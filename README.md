# Zuri Market

> Handcrafted African goods, delivered to Europe.  
> *DevOps capstone project — Lagos · London*

A small-format e-commerce storefront built end-to-end for the **2026 DevOps Bootcamp capstone**. The focus is on the infrastructure pipeline that ships the code, not the storefront itself.

---

## What this is

A two-tier web application:
- **Backend** — Node.js + Express API serving a 16-product catalogue
- **Frontend** — React + Vite storefront with cart, category filters, and artisan attribution

What makes it interesting isn't the app — it's the **pipeline that ships it**:

```
git push  →  GitHub Actions
              ├─ Build & push Docker images (DockerHub)
              ├─ npm audit (dependency CVE scan)
              ├─ Trivy scan (image CVE scan, blocks on CRITICAL)
              └─ Deploy to k3s on AWS EC2
                    └─ Init container fetches secret from AWS Secrets Manager
```

Every push to `main` triggers the above. The full chain runs in ~90 seconds with zero human intervention.

---

## Architecture

```
                  ┌──────────────────┐
   GitHub Actions │   build + scan   │
                  │   + deploy       │
                  └────────┬─────────┘
                           │ SSH + kubectl apply
                           ▼
        ┌──────────────────────────────────────┐
        │       EC2 (Amazon Linux 2023)         │
        │                                       │
        │   ┌──────────────────────────────┐   │
        │   │       k3s cluster             │   │
        │   │                               │   │
        │   │   ┌─────────┐  ┌──────────┐  │   │
        │   │   │ Backend │  │ Frontend │  │   │
        │   │   │ (init c)│  │  (nginx) │  │   │
        │   │   └────┬────┘  └──────────┘  │   │
        │   └────────┼──────────────────────┘   │
        │            │ IAM role                  │
        └────────────┼─────────────┬─────────────┘
                     │             │
                     ▼             ▼
            ┌─────────────┐  ┌──────────┐
            │ AWS Secrets │  │ DockerHub│
            │   Manager   │  │  Images  │
            └─────────────┘  └──────────┘
```

Infrastructure provisioned with **Terraform**:
- VPC + public subnet + internet gateway
- EC2 t3.small running k3s (single-node Kubernetes)
- IAM role for Secrets Manager read access (no AWS credentials in code)
- Security group with SSH/HTTPS/k3s-API rules

---

## Key design decisions

| Decision | Why |
|---|---|
| **k3s instead of EKS** | One-node demo; EKS costs ~$72/month minimum, k3s on t3.small is ~$15/month |
| **Init container for secrets** | Avoids CSI driver complexity on non-EKS clusters; uses EC2's IAM role directly |
| **Trivy fails on CRITICAL only** | OS-package HIGH severity is noisy in alpine; CRITICAL is the real gate |
| **`--omit=dev` in npm audit** | Dev dependencies (esbuild, vite) don't ship to production |
| **`nginx:alpine` not `nginx:1.27-alpine`** | Get latest patched Alpine line automatically; CI catches CVEs each build |
| **No plaintext secrets in YAML** | Init container fetches from AWS Secrets Manager at pod startup |

---

## Run locally

```bash
# 1. Backend
cd backend
cp .env.example .env  # edit values
npm install
npm start  # → http://localhost:4000

# 2. Frontend (separate terminal)
cd frontend
npm install
npm run dev  # → http://localhost:5173
```

Or with Docker:

```bash
docker compose up
# Frontend: http://localhost:8080
# Backend:  http://localhost:4000
```

---

## Deploy to AWS

```bash
# 1. Provision infrastructure
cd terraform
cp terraform.tfvars.example terraform.tfvars  # edit values
terraform init
terraform apply

# 2. Push code → CI/CD takes over
git push origin main
```

GitHub Actions handles the rest.

---

## Project structure

```
zuri-market/
├── .github/workflows/   # CI/CD pipeline
├── backend/             # Express API
├── frontend/            # React + Vite app
├── k8s/                 # Kubernetes manifests
├── terraform/           # AWS infrastructure
└── docker-compose.yml   # Local development
```

---

## What I'd do differently in production

- **Remote Terraform state** in S3 + DynamoDB lock (currently local)
- **AWS Session Manager** instead of opening SSH from CI runners
- **Self-hosted GitHub Actions runner** inside the VPC for deploys
- **Pin base images to digest** (`nginx:alpine@sha256:...`) for reproducibility
- **Multi-environment workflow** (dev → staging → prod) with environment-scoped secrets
- **Horizontal Pod Autoscaler** + multi-node cluster instead of single t3.small

---

## License

Educational project — DevOps Bootcamp 2026.