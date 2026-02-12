# Stage 1: Build dependencies
FROM node:20-alpine AS builder

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Install dependencies
RUN pnpm install --frozen-lockfile --prod

# Stage 2: Production runtime
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy dependencies from builder
COPY --from=builder /app/node_modules ./node_modules

# Copy application source
COPY --chown=nodejs:nodejs ./src ./src
COPY --chown=nodejs:nodejs package.json ./

# Switch to non-root user
USER nodejs

# Expose port (default 5000, can be overridden by env)
EXPOSE ${PORT:-5000}

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
    CMD node -e "require('http').get('http://localhost:${PORT:-5000}/welcome', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application
CMD ["node", "./src/index.js"]
