# Zuri Market — Frontend Dockerfile (multi-stage build)
# Stage 1 builds the React bundle; Stage 2 serves it with nginx.

# ============================================
# STAGE 1: Build the React app
# ============================================
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first for layer caching
COPY package*.json ./

# Install ALL deps (including devDeps — we need Vite to build)
RUN npm install --no-audit --no-fund

# Copy the source code
COPY . .

# Build-time environment variables.
# Vite embeds VITE_* values into the bundle at BUILD time, not runtime.
# Default to localhost:4000 for safety; in CI/CD we override these with --build-arg.
ARG VITE_API_URL=""
ARG VITE_STORE_NAME="Zuri Market"
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_STORE_NAME=$VITE_STORE_NAME

# Build the production bundle. Output goes to /app/dist/
RUN npm run build

# ============================================
# STAGE 2: Serve with nginx
# ============================================
FROM nginx:alpine AS runtime
# Note: alpine subimages get rolling updates. CI uses --pull to fetch latest patches.

# Copy nginx config for SPA routing (described below)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy the built bundle from Stage 1 into nginx's public directory
COPY --from=builder /app/dist /usr/share/nginx/html

# Container metadata — nginx serves on port 80 by default
EXPOSE 80

# Healthcheck — wget is included in nginx:alpine
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost/ || exit 1

# nginx runs as root by default to bind port 80; the nginx:alpine image's
# default CMD already starts nginx with proper signal handling, so we don't override it.