# Zuri Market — Backend Dockerfile
# Builds a production-ready container image for the Express API.

# --- Base image ---
# node:20-alpine = Node.js 20 on Alpine Linux. Small (~50 MB), secure, fast.
FROM node:20-alpine

# --- Set working directory ---
# All subsequent commands run inside /app within the container.
# If /app doesn't exist, Docker creates it.
WORKDIR /app

# --- Install dependencies first (cache-friendly) ---
# Copy package.json + package-lock.json BEFORE the source code.
# Why: if our source changes but dependencies don't, this layer is cached.
COPY package*.json ./

# Install only production dependencies (skip devDependencies if any).
# --omit=dev skips dev packages; --no-audit and --no-fund skip noisy CI checks.
RUN npm install --omit=dev --no-audit --no-fund

# --- Copy source code ---
# Now copy the actual app code. If only code changed, npm install is reused.
COPY . .

# --- Container metadata ---
# Document which port the app listens on. Doesn't actually open it.
EXPOSE 4000

# --- Healthcheck (k8s-style liveness probe) ---
# Pings /healthz every 30s. If 3 attempts fail, container is unhealthy.
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:4000/healthz || exit 1

# --- Run as a non-root user for security ---
# node:alpine ships with a built-in 'node' user. Use it.
USER node

# --- Start the server ---
# CMD is the default command Docker runs when the container starts.
# Use exec form (JSON array) for proper signal handling (Ctrl+C, k8s stop).
CMD ["node", "server.js"]