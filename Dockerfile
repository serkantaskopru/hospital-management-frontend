# Use a Node.js image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy everything to the container
COPY . .

# Expose port
EXPOSE 5555

CMD ["npm", "run", "dockerstart"]
