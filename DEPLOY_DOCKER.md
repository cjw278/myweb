# yvci 部署指南（Docker / 云服务器）

> 技术栈：Next.js 16 前端 + FastAPI 后端（含 Vue 管理后台）+ PostgreSQL。
> 本项目是 **JavaScript + Python**，没有 Java 的 "jar"；云部署的标准载体是 **Docker 镜像 / docker-compose**，腾讯云、阿里云、AWS、任意 Linux 服务器都能直接跑。

---

## 一、本地开发（不装 Docker 也能跑）

### 1. 后端
```bash
cd yvci-backend
python -m venv venv
venv\Scripts\activate            # Windows
pip install -r requirements.txt
cp .env.example .env            # 已为你生成 .env（PostgreSQL + 腾讯云 COS 占位）
python start.py                 # 启动后访问 http://localhost:8000/docs
```
- 数据库：`postgresql://postgres:123@localhost:5432/yvci`（已建好，首次启动自动建表）。
- 默认管理员账号：`admin` / `admin123`（登录地址 `/admin`）。

### 2. 前端
```bash
cd yvci
pnpm install                    # 或 npm install
pnpm dev                        # http://localhost:3000
```

### 3. 管理后台（可选，想用 /admin 才需要）
```bash
cd yvci-backend/admin
pnpm install
pnpm build                      # 产物输出到 admin/dist，后端会自动托管 /admin
```

---

## 二、Docker 一键部署（推荐上云方式）

### 前置
- 服务器装好 Docker 与 Docker Compose。
- 把整个 `yvci` 仓库（即根目录 `Kirameku-main`）上传到服务器。

### 构建并启动
```bash
# 在仓库根目录（docker-compose.yml 所在目录）
docker compose up -d --build
```
启动后访问服务器 IP（80 端口）即可。内部拓扑：
`浏览器 → nginx(80) → / → frontend(3000)`、`/api`、`/admin`、`/uploads` → `backend(8000)` → `db(postgres)`。

### 关键环境变量（生产务必修改）
在 `docker-compose.yml` 同级放一个 `.env` 文件，或通过云厂商密钥管理注入：

| 变量 | 说明 | 默认 |
|---|---|---|
| `SECRET_KEY` | JWT 签名密钥，**生产必须改成随机长串** | `change-me-please` |
| `COS_SECRET_ID` / `COS_SECRET_KEY` | 腾讯云 COS 密钥（仅后台上传图片需要） | 空（上传禁用） |
| `POSTGRES_PASSWORD`（compose 内） | 数据库密码 | `123` |

> 数据库密码、CORS、COS 配置都已在 `docker-compose.yml` / `nginx.conf` 里写好；改密码时记得同步 `db` 与 `backend` 两处的 `123`。

### 常用运维
```bash
docker compose ps                 # 查看状态
docker compose logs -f backend    # 看后端日志
docker compose down               # 停止
docker compose up -d --build      # 代码更新后重新构建
```

---

## 三、上云注意事项

1. **改默认密码**：上线前把 `POSTGRES_PASSWORD`、后端 `.env` 的 `SECRET_KEY`、以及 `/admin` 的 `admin123` 全部改掉。
2. **腾讯云 COS 密钥**：在 [访问管理 → API 密钥](https://console.cloud.tencent.com/cam/capi) 获取 `SecretId` / `SecretKey`，填进 `COS_SECRET_ID` / `COS_SECRET_KEY`，后台上传图片才会生效。Bucket 已配为 `yvce-1365610295`（广州）。
3. **域名与 HTTPS**：在 `nginx.conf` 的 `server` 块加 `listen 443 ssl;` 并配置证书即可启用 HTTPS；`CORS_ORIGINS` 加上你的域名。
4. **放行端口**：云安全组放通 80（443）端口；数据库 5432 只对内网开放，不要对外。
5. **数据持久化**：PostgreSQL 数据已挂载到 `pgdata` 卷，删除容器不会丢数据；备份可用 `docker compose exec db pg_dump -U postgres yvci > backup.sql`。

---

## 四、故障排查

- **`/admin` 打不开（白屏/404）**：说明 `admin/dist` 没生成。本地请先 `cd yvci-backend/admin && pnpm build`；Docker 下确认构建阶段 `pnpm build` 成功（admin 构建较吃内存，建议构建机 ≥ 4GB）。
- **登录提示密码错误**：确认用的是重置后的 `admin / admin123`；若数据被清空可重新执行 `init_db.sql`。
- **CORS 报错**：`CORS_ORIGINS` 没包含你的访问域名，补上即可。
- **上传图片失败 503**：COS 未配置，填写 `COS_SECRET_ID/KEY` 后重启 backend。
- **前端构建报依赖锁文件不一致**：Dockerfile 已做兜底（`--frozen-lockfile` 失败自动 `pnpm install`）。
