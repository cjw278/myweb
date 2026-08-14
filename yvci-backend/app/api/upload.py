import uuid
import traceback
import datetime
from io import BytesIO

from qcloud_cos import CosS3Client, CosConfig
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from PIL import Image

from app.deps import get_current_user
from app.config import (
    COS_SECRET_ID,
    COS_SECRET_KEY,
    COS_BUCKET,
    COS_REGION,
    COS_DOMAIN,
    COS_PREFIX,
)

router = APIRouter(prefix="/api/upload", tags=["上传"])

ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"}
MAX_SIZE = 10 * 1024 * 1024  # 10MB


def _get_client():
    if not (COS_SECRET_ID and COS_SECRET_KEY and COS_BUCKET and COS_REGION):
        raise HTTPException(
            503,
            "图床（腾讯云 COS）未配置，请在后端 .env 中填写 "
            "COS_SECRET_ID / COS_SECRET_KEY / COS_BUCKET / COS_REGION",
        )
    config = CosConfig(
        Region=COS_REGION,
        SecretId=COS_SECRET_ID,
        SecretKey=COS_SECRET_KEY,
    )
    return CosS3Client(config)


@router.post("/image")
async def upload_image(
    file: UploadFile = File(...),
    _: dict = Depends(get_current_user),
):
    try:
        if file.content_type not in ALLOWED_TYPES:
            raise HTTPException(400, f"不支持的文件类型: {file.content_type}")

        content = await file.read()
        if len(content) > MAX_SIZE:
            raise HTTPException(400, "文件大小不能超过 10MB")

        # 检测方向
        orientation = "landscape"
        try:
            img = Image.open(BytesIO(content))
            w, h = img.size
            orientation = "landscape" if w >= h else "portrait"
        except Exception:
            pass

        # 生成 COS 路径
        ext = file.filename.split(".")[-1] if file.filename and "." in file.filename else "webp"
        filename = f"{uuid.uuid4().hex}.{ext}"
        cos_key = f"{COS_PREFIX}{filename}"

        # 上传到腾讯云 COS
        client = _get_client()
        client.put_object(
            Bucket=COS_BUCKET,
            Body=content,
            Key=cos_key,
            ContentType=file.content_type or "application/octet-stream",
        )

        url = f"{COS_DOMAIN.rstrip('/')}/{cos_key}"
        return {"url": url, "orientation": orientation}
    except HTTPException:
        raise
    except Exception as exc:  # 兜底：避免裸 500，把真实错误写文件并返回 400
        tb = traceback.format_exc()
        try:
            with open("_upload_error.log", "a", encoding="utf-8") as _ef:
                _ef.write("\n==== " + datetime.datetime.now().isoformat() + " ====\n" + tb)
        except Exception:
            pass
        raise HTTPException(400, f"上传失败: {type(exc).__name__}: {exc}")
