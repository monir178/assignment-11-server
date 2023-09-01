# Capture Craze React App Server

## Overview

This repository contains the server-side code for the Capture Craze React App. The server is built using Express.js and utilizes JWT (JSON Web Tokens) for authentication. The server is deployed on Vercel for hosting.

## Getting Started

To set up and run the server locally, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/monir178/assignment-11-client
   ```

2. Navigate to the project directory:

   ```bash
   cd capture-craze-react-server
   ```

3. Install the required dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the project root directory and configure the following environment variables:

   - `PORT`: The port on which the server will run (e.g., 3000).
   - `JWT_SECRET`: A secret key for JWT token generation.
   - `DATABASE_URL`: The URL of your database (e.g., MongoDB Atlas).

   Example `.env` file:

   ```dotenv
   PORT=5000
   JWT_SECRET=your-secret-key
   DATABASE_URL=mongodb+srv://your-username:your-password@cluster.mongodb.net/your-database
   ```

5. Start the server:

   ```bash
   npm start
   ```

The server will now be running locally at the specified port.

## API Endpoints

The server exposes the following API endpoints:

- `POST /api/auth/register`: Register a new user.
- `POST /api/auth/login`: Authenticate a user and generate a JWT token.
- `GET /api/photos`: Retrieve a list of photos.
- `POST /api/photos`: Upload a new photo (requires authentication).
- `GET /api/photos/:id`: Retrieve a specific photo by ID.
- `PUT /api/photos/:id`: Update a specific photo by ID (requires authentication).
- `DELETE /api/photos/:id`: Delete a specific photo by ID (requires authentication).

## Deployment

This server is deployed on Vercel, a serverless platform for hosting JavaScript applications. Deployment is configured using the Vercel CLI or through Vercel's GitHub integration.

To deploy your own instance of the server to Vercel, follow the Vercel deployment guide for Node.js applications: [Vercel Node.js Deployment](https://capture-craze-server.vercel.app/).

## Security

- Ensure that your `.env` file with sensitive information is never committed to version control. Use `.gitignore` to exclude it.
- Implement proper error handling and validation to enhance security.
- Regularly update dependencies to address security vulnerabilities.

## Contributing

If you wish to contribute to this project, please fork the repository, create a new branch, and submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


Thank you for using Capture Craze React App Server!