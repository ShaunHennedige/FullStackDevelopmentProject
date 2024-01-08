## Project Contributors

Venura Deegalla - 10818175 <br>
Mindula Silva   - 10820799 <br>
Shaun Hennedige - 10818172 <br>


# ROOMRESERVE MERN App Setup Guide

This guide will help you set up the ROOMRESERVE Booking App on your local machine.

## Prerequisites

Make sure you have Node.js installed on your system.

## User Credentials

# ROOMRESERVE Credentials:
Username: admin@test.com  
Password: admin12345

# MONGODB Credentials:
Username: admin  
Password: 12345

## Backend Configuration

1. **Environment Files used same as in the project**: In the `backend` folder, create two files: `.env` and `.env.e2e`. Add the following contents to both:

for .env (Development):
  MONGODB_CONNECTION_STRING=mongodb+srv://admin:12345@cluster0.nxbydwn.mongodb.net/?retryWrites=true&w=majority

for .env.e2e (Testing):
  MONGODB_CONNECTION_STRING=mongodb+srv://admin:12345@e2e-test-db.e5ppx4q.mongodb.net/?retryWrites=true&w=majority

JWT_SECRET_KEY=WTDAsfTnnw
FRONTEND_URL=http://localhost:3000

# Cloudinary Variables
CLOUDINARY_CLOUD_NAME=ddgk5xpet  
CLOUDINARY_API_KEY=358892549562633  
CLOUDINARY_API_SECRET=8yJcZwilG8XGCJJS7vpV07NJecQ

# Stripe
STRIPE_API_KEY=sk_test_51OVSpqJHXrZG3O6fWGmq7tYCbR3yETMrm26AwSOU9udtn2bPXSTaOizLJVdPMSYS4L0DpOErccUEXbbF9zzH3vuR00arfe2TL3

## Running the Application

1. **Backend**:
    - Navigate to the `backend` directory.
    - Install dependencies: `npm install`.
    - Start the server: `npm start`.

2. **Frontend**:
    - Open a new terminal and navigate to the `frontend` directory.
    - Install dependencies: `npm install`.
    - Start the frontend application: `npm run dev`.
    - Verify the application at `http://localhost:5173` in your terminal.

## Running Automated Tests

1. **MongoDB Setup**: 
    - Create a new MongoDB database for tests.
    - Sign up for MongoDB Atlas (https://www.mongodb.com/cloud/atlas).
    - Create a new project (e.g., e2e tests).
    - Set up a new database in a new cluster.
    - Get the MongoDB connection string and add it to the `MONGODB_CONNECTION_STRING` variable in your `.env.e2e` file.
      
2. **Importing Test Data into MongoDB**:

    - The repository contains a `data` folder with JSON files for a test user and a test hotel. Import these into your MongoDB collections.
    - **Locate the Test User File**: In the `data` folder, find the file with test user data (e.g., `test-users.json`).
    - **Open MongoDB Compass**: Connect to your database.
    - **Select the Database**: Choose the automated tests database.
    - **Import User Data**:
        - Navigate to the `users` collection. Create it if it doesn't exist.
        - Click "Add Data" and select "Import File".
        - Browse to `test-users.json` and import it.
        - The test user data will be in the `users` collection.
        - User login: `1@1.com/password123`.
    -  **Locate the Test Hotel File**:
        - Navigate to the `hotels` collection. Create it if it doesn't exist.
        - Repeat the import process for `test-hotel.json`.
        - Ensure the format is JSON and click "Import".
        - The test hotel data will be in the `hotels` collection.
 
3. **Running tests**:
    - Install the [Playwright extension](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) in VS Code.
    - Navigate to the `e2e-tests` directory.
    - Install dependencies: `npm install`.
    - Start the frontend and backend servers.
    - [Run the tests using the Playwright extension](https://playwright.dev/docs/getting-started-vscode#running-tests).

    
