# GrexCode Deployment Guide

Host GrexCode by Grexlabs on any platform. Each section contains copy-paste ready commands and configurations.

---

## 1. VPS (Linux)

### Systemd Service

Create `/etc/systemd/system/grexcode.service`:

```ini
[Unit]
Description=GrexCode by Grexlabs
After=network.target

[Service]
Type=simple
User=grexcode
Group=grexcode
WorkingDirectory=/opt/grexcode
ExecStart=/usr/bin/node /opt/grexcode/dist/server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production
Environment=PORT=3000
Environment=DATABASE_URL=postgresql://user:pass@localhost:5432/grexcode
Environment=SESSION_SECRET=<generate-with: openssl rand -hex 32>
Environment=GIT_STORAGE_PATH=/var/lib/grexcode/repos
Environment=MAX_UPLOAD_SIZE=104857600

[Install]
WantedBy=multi-user.target
```

Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now grexcode
sudo systemctl status grexcode
```

### Nginx Reverse Proxy

`/etc/nginx/sites-available/grexcode`:

```nginx
server {
    listen 80;
    server_name grexcode.example.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
```

Enable:

```bash
sudo ln -s /etc/nginx/sites-available/grexcode /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### SSL with Let's Encrypt

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d grexcode.example.com
sudo systemctl enable --now certbot.timer
```

Auto-renewal is handled by the systemd timer. Test with:

```bash
sudo certbot renew --dry-run
```

---

## 2. Docker

### Dockerfile

Place in project root:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/server.js"]
```

Build:

```bash
docker build -t grexcode .
docker run -d --name grexcode \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://user:pass@host:5432/grexcode \
  -e SESSION_SECRET=$(openssl rand -hex 32) \
  -v grexcode_data:/var/lib/grexcode \
  grexcode
```

### docker-compose.yml

```yaml
version: "3.8"

services:
  grexcode:
    image: ghcr.io/grexlabs/grexcode:latest
    restart: unless-stopped
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: production
      PORT: 3000
      DATABASE_URL: postgresql://grexcode:${DB_PASSWORD}@db:5432/grexcode
      SESSION_SECRET: ${SESSION_SECRET}
      GIT_STORAGE_PATH: /data/repos
      MAX_UPLOAD_SIZE: 104857600
    volumes:
      - grexcode_data:/data
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      POSTGRES_DB: grexcode
      POSTGRES_USER: grexcode
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U grexcode"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  grexcode_data:
  postgres_data:
```

Create `.env`:

```
DB_PASSWORD=<secure-random-password>
SESSION_SECRET=<openssl rand -hex 32>
```

Run:

```bash
docker compose up -d
docker compose logs -f
```

### ghcr.io/grexlabs/grexcode

Pull the official image:

```bash
docker pull ghcr.io/grexlabs/grexcode:latest
docker run -d --name grexcode -p 3000:3000 ghcr.io/grexlabs/grexcode:latest
```

---

## 3. Railway

### railway.json

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "npm run build"
  },
  "deploy": {
    "startCommand": "node dist/server.js",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 30,
    "restartPolicyType": "ON_FAILURE"
  }
}
```

### Procfile (alternative)

```
web: node dist/server.js
```

### Environment Variables

Set in Railway dashboard or via CLI:

```
NODE_ENV=production
PORT=3000
DATABASE_URL=<provided by Railway Postgres plugin>
SESSION_SECRET=<generated>
GIT_STORAGE_PATH=/data/repos
MAX_UPLOAD_SIZE=104857600
```

Deploy:

```bash
railway login
railway init
railway link
railway up
```

Attach a Postgres plugin from the Railway dashboard — it injects `DATABASE_URL` automatically.

---

## 4. Render

### Web Service Config

In the Render Dashboard:

- **Type**: Web Service
- **Build Command**: `npm install && npm run build`
- **Start Command**: `node dist/server.js`
- **Health Check Path**: `/health`

### Environment Variables

| Variable | Value |
|---|---|
| `NODE_ENV` | `production` |
| `PORT` | `10000` (Render's default) |
| `DATABASE_URL` | PostgreSQL internal URL |
| `SESSION_SECRET` | `openssl rand -hex 32` |

Deploy via Git:

```bash
# Push to a Git repo connected to Render
git push render main
```

Or use the Render CLI:

```bash
render login
render deploy
```

Render attaches a public URL like `https://grexcode.onrender.com`. Custom domains can be configured in the dashboard under **Settings > Custom Domain**.

---

## 5. Fly.io

### fly.toml

```toml
app = "grexcode"
primary_region = "iad"

[build]
  image = "ghcr.io/grexlabs/grexcode:latest"

[http_service]
  internal_port = 3000
  force_https = true
  auto_stop_machines = false
  auto_start_machines = true
  min_machines_running = 1
  processes = ["app"]

[[services]]
  protocol = "tcp"
  internal_port = 3000

  [[services.ports]]
    port = 80
    handlers = ["http"]
    force_https = true

  [[services.ports]]
    port = 443
    handlers = ["tls", "http"]

[env]
  NODE_ENV = "production"
  PORT = "3000"
  GIT_STORAGE_PATH = "/data/repos"
  MAX_UPLOAD_SIZE = "104857600"
```

### Deployment Commands

```bash
# Install flyctl: https://fly.io/docs/hands-on/install-flyctl/
fly auth login
fly launch --image ghcr.io/grexlabs/grexcode:latest --name grexcode
fly secrets set DATABASE_URL=<postgres-connection-string>
fly secrets set SESSION_SECRET=$(openssl rand -hex 32)
fly deploy
```

Attach a Fly Postgres cluster:

```bash
fly postgres create --name grexcode-db
fly postgres attach grexcode-db
```

Scale:

```bash
fly scale memory 512
fly scale count 2
```

---

## 6. Cloudflare

### Cloudflare Workers

For API-only deployments, create `wrangler.toml`:

```toml
name = "grexcode-api"
main = "dist/worker.js"
compatibility_date = "2025-01-01"

[vars]
NODE_ENV = "production"

[[d1_databases]]
binding = "DB"
database_name = "grexcode"
database_id = "<your-db-id>"
```

Deploy:

```bash
npm install -g wrangler
wrangler login
wrangler deploy
```

> **Note**: Workers have a 10 ms CPU timeout. Self-host or use a VPS for full GrexCode workloads. Workers are suitable for lightweight API proxying.

### Cloudflare Pages (Web UI)

For the GrexCode frontend only:

```bash
# In the web-ui/ directory
wrangler pages deploy ./dist --project-name grexcode
```

Or connect a Git repo in the Cloudflare Dashboard: **Workers & Pages > Create > Pages > Connect to Git**. Set build command to `npm run build` and output directory to `dist`.

### Cloudflare Tunnel (Self-Hosted)

Expose a GrexCode VPS without opening firewall ports:

```bash
# Install cloudflared
wget https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64
sudo mv cloudflared-linux-amd64 /usr/local/bin/cloudflared
sudo chmod +x /usr/local/bin/cloudflared

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create grexcode

# Route DNS
cloudflared tunnel route dns grexcode grexcode.example.com

# Create config file ~/.cloudflared/config.yml:
```

```yaml
tunnel: <tunnel-uuid>
credentials-file: /root/.cloudflared/<tunnel-uuid>.json

ingress:
  - hostname: grexcode.example.com
    service: http://localhost:3000
  - service: http_status:404
```

Run as a systemd service:

```bash
sudo cloudflared --config ~/.cloudflared/config.yml service install
sudo systemctl enable --now cloudflared
```

---

## 7. Vercel (Frontend Only)

### Web UI Deployment

Deploy the GrexCode frontend from the `web-ui/` directory (or wherever the frontend lives):

```json
{
  "name": "grexcode-webui",
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "https://grexcode-api.example.com/$1" },
    { "src": "/(.*)", "dest": "/index.html" }
  ]
}
```

Or use `vercel.json` directly:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://grexcode-api.example.com/$1" }
  ]
}
```

### Environment Variables

Set in Vercel dashboard or via CLI:

| Variable | Value |
|---|---|
| `VITE_API_URL` | `https://grexcode-api.example.com` |
| `VITE_APP_NAME` | `GrexCode` |
| `VITE_SENTRY_DSN` | (optional) |

### CLI Deployment

```bash
npm i -g vercel
vercel login
vercel --prod
```

Connect a Git repo for auto-deploys: **Vercel Dashboard > Add New Project > Import Git Repository**.

---

## Environment Reference

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | HTTP listen port |
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SESSION_SECRET` | Yes | 32+ byte hex secret |
| `NODE_ENV` | Yes | `production` or `development` |
| `GIT_STORAGE_PATH` | No | Git repo storage directory |
| `MAX_UPLOAD_SIZE` | No | Max upload in bytes (default 100 MB) |
| `LOG_LEVEL` | No | `debug`, `info`, `warn`, `error` |

---

## Verification

After deploying, verify GrexCode is healthy:

```bash
curl https://your-domain.com/health
# Expected: {"status":"ok","version":"x.y.z"}
```

---

*Built by Grexlabs — deploy GrexCode anywhere.*
