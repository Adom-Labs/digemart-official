# ---------- Build Stage ----------
FROM node:20-slim AS builder

WORKDIR /app

# Copy only dependency files first (for layer caching)
COPY package*.json ./

# Install all dependencies
RUN npm ci --legacy-peer-deps

# Copy rest of the source code
COPY . .

# Build the Next.js application
RUN npm run build

# ---------- Production Stage ----------
FROM node:20-slim AS runner

WORKDIR /app

# Install dumb-init to handle PID 1 and signals properly
RUN apt-get update && apt-get install -y --no-install-recommends dumb-init \
  && rm -rf /var/lib/apt/lists/*

# Copy only package files for dependency resolution
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev --legacy-peer-deps

# Copy built app and static assets from builder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./next.config.mjs
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Ensure Next.js runs in standalone mode if supported
# For faster cold starts and smaller image
# (uncomment if you use `output: "standalone"` in next.config.mjs)
# COPY --from=builder /app/.next/standalone ./
# COPY --from=builder /app/public ./public

# Use dumb-init as entrypoint
ENTRYPOINT ["dumb-init", "--"]

# Start Next.js
CMD ["npm", "start"]
