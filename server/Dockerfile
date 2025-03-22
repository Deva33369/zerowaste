FROM node:16-alpine

WORKDIR /app

# Copy package.json from server directory
COPY package*.json ./
RUN npm install

# Copy server directory contents
COPY . .

EXPOSE 5002

CMD ["node", "server.js"]
