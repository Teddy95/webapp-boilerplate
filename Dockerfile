# Starting from Node.js Version 18
FROM node:18

# Create App directory
WORKDIR /usr/src/app

# Copy App source code
COPY . .

# Install npm modules
RUN npm install

# Compile App
RUN npm run build

# Expose Server Port
EXPOSE 8080 80

# Start Node App
CMD ["npm", "run", "start"]
