# Starting from Node.js Version 10 (LTS)
FROM node:10

# Create App directory
WORKDIR /usr/src/app

# Copy App source code
COPY . .

# Install npm modules
RUN npm install

# Compile App
RUN npm run build

# Expose Server Port
EXPOSE 8080

# Start Node App
CMD ["npm", "run", "start"]
