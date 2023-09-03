# Use Node.js 18 as the base image for your backend
FROM node:18

# Set the working directory inside the container
WORKDIR /app

# Copy the backend package.json and package-lock.json to the container
COPY package*.json ./

# Install backend dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Expose the port your Node.js backend will run on (change to your app's port)
EXPOSE 3000

# Start your Node.js backend
CMD ["nodemon", "server.js"]
