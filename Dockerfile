FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

# If you are building your code for production
RUN npm ci --omit=dev

COPY . .
EXPOSE 4000
CMD [ "node", "server.ts" ]