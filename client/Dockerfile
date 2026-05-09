FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --prefer-offline --no-audit

COPY . .

EXPOSE 5173

# Run vite with explicit host binding
CMD ["npm", "run", "dev", "--", "--host"]
