# Step 1: Use an official Node.js runtime as a base image
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /app

# Step 3: Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Step 4: Install the app dependencies
RUN npm install

# Step 5: Copy the rest of the app's source code to the working directory
COPY . .

# Step 6: Expose the port your app will run on
EXPOSE 8080

# Step 7: Define the command to run the app
CMD ["npm", "start"]
