# Use the official lightweight Node.js 18 image.
# https://hub.docker.com/_/node
FROM node:18-slim

# Create and change to the app directory.
WORKDIR /usr/src/app

# A wildcard is used to ensure both package.json AND package-lock.json are copied.
COPY package*.json ./

RUN npm install --only=production

COPY . ./

# Build the app
RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
