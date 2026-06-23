# Deploying GrexCode

> Deployment guide for GrexCode, a fork of OpenCode by Grexlabs.

---

## Overview

GrexCode can be deployed in several configurations depending on your use case:

- **Server Mode** — Multi-tenant backend service with a REST/WebSocket API
- **Desktop Application** — End-user native client (standalone)
- **Console / CLI** — Headless terminal-based access (single-user)
- **Self-Hosted** — Full stack running on your own infrastructure

This document focuses primarily on **Server Mode** and **Self-Hosted** deployments.

---

## Infrastructure Stack

GrexCode's server infrastructure is defined using [SST](https://sst.dev) and [AWS CDK](https://aws.amazon.com/cdk/).

| Component       | Technology       |
|-----------------|------------------|
| Compute         | AWS Lambda / ECS |
| Database        | PostgreSQL (RDS) |
| Cache           | Redis (ElastiCache / Valkey) |
| File Storage    | S3-compatible    |
| Message Queue   | SQS / RabbitMQ   |
| Container Registry | ECR / Docker Hub |
| Secrets         | AWS Secrets Manager / Vault |

### Deploying with SST

```bash
cd infra
bun install
npx sst deploy --stage production
```

### Deploying with CDK directly

```bash
cd infra/cdk
bun install
cdk deploy --all
```

---

## Self-Hosted Deployment

GrexCode supports fully self-hosted deployments. You can run the server binary directly or use the provided Docker image.

### Server Mode

```bash
grexcode serve [options]
```

Options:

| Flag                 | Default           | Description                            |
|----------------------|-------------------|----------------------------------------|
| `--port`             | `8080`            | HTTP server port                       |
| `--host`             | `0.0.0.0`         | Bind address                           |
| `--db-url`           | *(required)*      | PostgreSQL connection string           |
| `--redis-url`        | `redis://localhost:6379` | Redis connection string       |
| `--storage-dir`      | `./data`          | Local file storage directory           |
| `--log-level`        | `info`            | Logging verbosity                      |
| `--cors-origin`      | `*`               | Allowed CORS origins                   |
| `--max-file-size`    | `50mb`            | Maximum upload file size               |
| `--rate-limit`       | `100/min`         | API rate limit per IP                  |

Example:

```bash
grexcode serve \
  --port 8080 \
  --db-url "postgresql://user:pass@db.example.com:5432/grexcode" \
  --redis-url "redis://redis.example.com:6379" \
  --storage-dir /var/lib/grexcode/data \
  --log-level debug
```

---

## Docker Deployment

### Official Image

```bash
docker pull ghcr.io/grexlabs/grexcode:latest
```

### docker-compose

```yaml
version: "3.9"
services:
  grexcode:
    image: ghcr.io/grexlabs/grexcode:latest
    ports:
      - "8080:8080"
    environment:
      GREXCODE_DB_URL: "postgresql://user:pass@postgres:5432/grexcode"
      GREXCODE_REDIS_URL: "redis://redis:6379"
      GREXCODE_STORAGE_DIR: "/data"
      GREXCODE_LOG_LEVEL: "info"
      GREXCODE_JWT_SECRET: "${GREXCODE_JWT_SECRET}"
    volumes:
      - grexcode-data:/data
    depends_on:
      - postgres
      - redis
    restart: unless-stopped

  postgres:
    image: postgres:16
    environment:
      POSTGRES_DB: grexcode
      POSTGRES_USER: grexcode
      POSTGRES_PASSWORD: "${POSTGRES_PASSWORD}"
    volumes:
      - pgdata:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U grexcode"]
      interval: 5s
      timeout: 5s
      retries: 5

  redis:
    image: valkey/valkey:8
    volumes:
      - redis-data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 3s
      retries: 5

volumes:
  grexcode-data:
  pgdata:
  redis-data:
```

Start the stack:

```bash
docker compose up -d
```

---

## Environment Variables

All server settings can be configured via environment variables.

| Variable                     | Default              | Description                             |
|------------------------------|----------------------|-----------------------------------------|
| `GREXCODE_PORT`              | `8080`               | HTTP server port                        |
| `GREXCODE_HOST`              | `0.0.0.0`            | Bind address                            |
| `GREXCODE_DB_URL`            | —                    | PostgreSQL connection string            |
| `GREXCODE_REDIS_URL`         | `redis://localhost:6379` | Redis connection string             |
| `GREXCODE_STORAGE_DIR`       | `./data`             | File storage path                       |
| `GREXCODE_LOG_LEVEL`         | `info`               | Log level (trace/debug/info/warn/error) |
| `GREXCODE_JWT_SECRET`        | —                    | JWT signing secret (required)           |
| `GREXCODE_JWT_EXPIRY`        | `24h`                | JWT token lifetime                      |
| `GREXCODE_CORS_ORIGIN`       | `*`                  | CORS allowed origins                    |
| `GREXCODE_RATE_LIMIT`        | `100/min`            | API rate limit                          |
| `GREXCODE_MAX_FILE_SIZE`     | `50mb`               | Maximum upload size                     |
| `GREXCODE_SSL_CERT`         | —                    | Path to TLS certificate                 |
| `GREXCODE_SSL_KEY`          | —                    | Path to TLS private key                 |
| `GREXCODE_OTLP_ENDPOINT`    | —                    | OpenTelemetry OTLP endpoint             |
| `GREXCODE_OTLP_HEADERS`     | —                    | OpenTelemetry exporter headers          |
| `GREXCODE_ENCRYPTION_KEY`   | —                    | Encryption key for sensitive data       |

---

## SSL / TLS Configuration

### Using built-in TLS

```bash
grexcode serve \
  --ssl-cert /etc/certs/fullchain.pem \
  --ssl-key /etc/certs/privkey.pem
```

### Behind a reverse proxy (recommended)

```nginx
# nginx example
server {
    listen 443 ssl;
    server_name grexcode.example.com;

    ssl_certificate     /etc/letsencrypt/live/grexcode.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/grexcode.example.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Scaling Considerations

| Layer            | Strategy                                    |
|------------------|---------------------------------------------|
| **Application**  | Stateless — scale horizontally behind a load balancer |
| **Database**     | PostgreSQL read replicas, connection pooling (PgBouncer) |
| **Cache**        | Redis Cluster or Valkey for distributed caching |
| **File Storage** | Use S3-compatible storage instead of local disk |
| **Rate Limiting**| Centralized via Redis, not in-memory        |
| **Sessions**     | Store in Redis — do not rely on sticky sessions |

### Horizontal Scaling

```bash
# Start multiple instances behind a load balancer
grexcode serve --port 8080
grexcode serve --port 8081
```

All instances share the same PostgreSQL and Redis backends.

---

## Monitoring

GrexCode exports observability data via [OpenTelemetry](https://opentelemetry.io).

### Metrics & Tracing

```bash
grexcode serve \
  --otlp-endpoint http://otel-collector:4318 \
  --otlp-headers "Authorization=Bearer ${OTEL_AUTH_TOKEN}"
```

### Health Check Endpoint

```
GET /health
```

Returns `200 OK` when the service is healthy, `503` otherwise.

### Metrics Endpoint

```
GET /metrics
```

Prometheus-formatted metrics (when OpenTelemetry is configured or Prometheus exporter is enabled).

### Key Metrics

| Metric                              | Type      | Description                      |
|-------------------------------------|-----------|----------------------------------|
| `grexcode_requests_total`           | Counter   | Total HTTP requests              |
| `grexcode_request_duration_seconds` | Histogram | Request latency distribution     |
| `grexcode_active_connections`       | Gauge     | Active WebSocket connections     |
| `grexcode_api_errors_total`         | Counter   | API error count by status code   |
| `grexcode_llm_tokens_total`         | Counter   | LLM token usage                  |
| `grexcode_db_pool_connections`      | Gauge     | Database connection pool size    |

---

## Backup and Restore

### Database

```bash
# Backup
pg_dump -h localhost -U grexcode grexcode > grexcode-backup-$(date +%F).sql

# Restore
psql -h localhost -U grexcode grexcode < grexcode-backup-2025-06-01.sql
```

### File Storage

```bash
# Local storage backup
tar -czf grexcode-storage-$(date +%F).tar.gz /var/lib/grexcode/data

# S3 backup with aws-cli
aws s3 sync /var/lib/grexcode/data s3://grexcode-backups/data/
```

### Redis (cache — not critical)

```bash
# Snapshot
redis-cli SAVE
cp /var/lib/redis/dump.rdb redis-backup.rdb

# Restore
cp redis-backup.rdb /var/lib/redis/dump.rdb
redis-cli CONFIG SET dir /var/lib/redis
```

### Full System Backup

```bash
#!/bin/bash
# Comprehensive GrexCode backup script
BACKUP_DIR="/backups/grexcode/$(date +%F)"
mkdir -p "$BACKUP_DIR"
pg_dump -h localhost -U grexcode grexcode > "$BACKUP_DIR/database.sql"
tar -czf "$BACKUP_DIR/storage.tar.gz" /var/lib/grexcode/data
find "$BACKUP_DIR" -mtime +30 -delete
```

---

## Production Checklist

- [x] Use a strong, unique `GREXCODE_JWT_SECRET` (minimum 32 characters)
- [x] Set `GREXCODE_ENCRYPTION_KEY` for data encryption at rest
- [x] Enable TLS (either built-in or behind a reverse proxy)
- [x] Configure rate limiting for the API
- [x] Set up database connection pooling (PgBouncer)
- [x] Use S3-compatible storage instead of local disk for production
- [x] Configure OpenTelemetry for observability
- [x] Schedule regular backups (database + file storage)
- [x] Run `grexcode doctor` to verify the deployment

---

*GrexCode — maintained by Grexlabs.*
