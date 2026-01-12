# Build stage
FROM node:22-bookworm-slim AS build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Runtime stage
FROM node:22-bookworm-slim AS runtime

WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev

# Copy compiled code from build stage
COPY --from=build /app/dist ./dist

# Create a non-root user and switch to it
USER node

# Expose the port
EXPOSE 3000

# Entrypoint to run the Fastify server
CMD ["node", "dist/src/interfaces/http/server.js"]
