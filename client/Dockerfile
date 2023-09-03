# Use an official Node.js runtime as the base image for building the React app
FROM node:18 as build

# Set the working directory inside the container
WORKDIR /app

# Copy the frontend package.json and package-lock.json to the container
COPY package*.json ./

# Install frontend dependencies
RUN npm install

# Copy the rest of the frontend code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Create a production-ready image without Node.js for serving the app
FROM scratch

# Copy the built React app from the build stage to the production image
COPY --from=build /app/build /app

# Expose port 80 (or the port you intend to use)
EXPOSE 80

# Specify the command to serve the React app (e.g., using a simple HTTP server)
CMD ["npx", "serve", "-s", "/app", "-p", "80"]
