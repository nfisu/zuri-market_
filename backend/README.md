# Zuri Market — Backend

Express API serving the product catalogue and cart validation for Zuri Market.

---

## What it does

A small REST API with 6 endpoints:

| Method | Path | Purpose |
|---|---|---|
| GET | `/healthz` | Liveness probe (returns 200 OK) |
| GET | `/api/store/config` | Store name, currency, categories |
| GET | `/api/products` | Full product catalogue (filterable by category) |
| GET | `/api/products/featured` | 8 featured products |
| GET | `/api/products/:id` | Single product detail |
| POST | `/api/cart/validate` | Server-side cart validation (price + stock) |

---

## Tech stack

- **Node.js 20** on Alpine Linux
- **Express 4.19** with `cors` and `morgan` for logging
- No database — 16 products hardcoded in `data/products.js` (capstone scope)

---

## Environment variables

| Variable | Purpose | Default |
|---|---|---|
| `PORT` | HTTP port | 4000 |
| `STORE_NAME` | Display name | "Zuri Market" |
| `CURRENCY` | Currency code | "GBP" |
| `API_SECRET_KEY` | Sample secret (loaded from AWS Secrets Manager in prod) | — |
| `ALLOWED_ORIGINS` | CORS allowlist (comma-separated) | `http://localhost:5173` |

See `.env.example` for the local-dev template.

---

## Run locally

```bash
cp .env.example .env  # fill in values
npm install
npm start
```

API at http://localhost:4000.

Test the health endpoint:

```bash
curl http://localhost:4000/healthz
# → ok
```

---

## Build the Docker image

```bash
docker build -t zuri-market-backend:dev .
docker run --rm -p 4000:4000 --env-file .env zuri-market-backend:dev
```

The Dockerfile uses `node:20-alpine` and runs as the non-root `node` user (security).

---

## Secrets pattern

In production, `API_SECRET_KEY` is **not** in environment variables at build time. The Kubernetes pod uses an **init container** that:

1. Runs `aws secretsmanager get-secret-value` using the EC2's IAM role
2. Writes the secret to a shared in-memory volume (`emptyDir: { medium: Memory }`)
3. The main backend container reads it at startup via a wrapper shell command

See `k8s/backend-deployment.yaml` for the full pattern.

This way:
- ✅ No secrets in YAML
- ✅ No AWS credentials in code
- ✅ No secret ever written to disk
- ✅ Secret rotates by updating AWS Secrets Manager — no redeploy needed