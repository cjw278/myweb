# ---- Stage 1: 构建 Vue 管理后台 ----
FROM node:20-alpine AS admin-build
WORKDIR /src/admin
RUN corepack enable && corepack prepare pnpm@9 --activate
# 跳过 husky 的 prepare 钩子（容器内无 .git，否则 pnpm install 会失败）
ENV HUSKY=0
COPY admin/package.json admin/pnpm-lock.yaml admin/.npmrc* ./
RUN pnpm install --frozen-lockfile
COPY admin/ ./
RUN pnpm build

# ---- Stage 2: Python 后端 ----
FROM python:3.12-slim
WORKDIR /app
ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
ENV TZ=Asia/Shanghai

# 依赖均为预编译 wheel（psycopg2-binary / Pillow），无需系统编译链
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app
COPY start.py ./
COPY init_db.sql ./

# 把构建好的管理后台静态文件带进来（main.py 会挂载 /admin）
COPY --from=admin-build /src/admin/dist ./admin/dist

EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
