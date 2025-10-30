FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose backend port (adjust if using a different port)
EXPOSE 3000

# Start the app using the start script
CMD ["npm", "start"]
