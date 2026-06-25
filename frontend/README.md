# Zuri Market — Frontend

React + Vite storefront for Zuri Market. Hits the backend API for product data, manages cart state locally.

---

## What it does

- 16-product catalogue grid with category filter pills (Jewellery / Fashion / Skincare / Homeware)
- Featured Pieces section (8 products marked `featured: true` from the API)
- Cart drawer with add/remove and server-side validation on submit
- Hero section with brand voice and artisan attribution on every product card
- Responsive layout, single-page app (SPA) — nginx serves the bundle with fallback to `/index.html`

---

## Tech stack

- **React 18** with hooks (no state library — `useState` + props)
- **Vite 5** for the dev server and production bundle
- Custom CSS (no Tailwind / CSS-in-JS — single `styles.css`)
- Fonts: **Fraunces** (serif headings) + **Inter** (body)

---

## Environment variables

| Variable | Purpose | Local default |
|---|---|---|
| `VITE_API_URL` | Backend base URL (empty = relative URLs through ingress) | `""` |
| `VITE_STORE_NAME` | Display name | `"Zuri Market"` |

Vite embeds `VITE_*` variables into the bundle at **build time**, not runtime. To change them in production, rebuild the image with new `--build-arg` values.

---

## Run locally

```bash
npm install
npm run dev
```

Dev server at http://localhost:5173. Vite proxies `/api/*` requests to the backend on port 4000 (see `vite.config.js`).

---

## Build for production

```bash
npm run build
```

Output goes to `dist/`. The production build is then served by nginx (see `Dockerfile`).

---

## Build the Docker image

```bash
docker build \
  --build-arg VITE_API_URL="" \
  -t zuri-market-frontend:dev \
  .
docker run --rm -p 8080:80 zuri-market-frontend:dev
```

Storefront at http://localhost:8080.

The Dockerfile is **multi-stage**:
1. Stage 1 (`node:20-alpine`) — installs dependencies, runs `npm run build`, produces `/dist`
2. Stage 2 (`nginx:alpine`) — copies `/dist` into nginx's html dir, serves on port 80

The final image is ~21 MB (mostly nginx-alpine; the React bundle itself is ~150 KB gzipped).

---

## How nginx is configured

See `nginx.conf`:
- `try_files $uri /index.html` — SPA routing fallback so React Router can handle paths
- `/healthz` → returns `200 ok` (Kubernetes liveness probe)
- `/assets/` caches 1 year (immutable hashed filenames)
- `gzip on` for text content

---

## API URL handling

`src/api.js` uses `??` (nullish coalescing), not `||`:

```js
const API_URL = import.meta.env.VITE_API_URL ?? '';
```

This matters because `VITE_API_URL=""` (empty string) is the *intended* value in production (= use relative URLs through the ingress). The previous `||` operator treated empty string as falsy and fell back to `localhost:4000`, which broke the build for ~2 hours during Phase 4.