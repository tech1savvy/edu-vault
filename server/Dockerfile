# Use lightweight Node image
FROM node:20-alpine

# Install pnpm
RUN npm install -g pnpm

# Create app directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json pnpm-lock.yaml ./

# Install dependencies
RUN pnpm install --prod --frozen-lockfile

# Copy source code
COPY . .

# Expose backend port
EXPOSE 8000

# Start server
CMD ["node", "index.js"]
