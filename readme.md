# File-Forge-Backend

File-Forge-Backend is the powerful and secure backend for the File-Forge application, a feature-rich file storage and management solution. Built with a modern tech stack, it provides a robust and scalable foundation for handling all your file-related needs, from user authentication and file uploads to API key management and in-depth analytics.

## Features

*   **Secure User Authentication:** Employs a comprehensive authentication system using Passport.js and JSON Web Tokens (JWT). User passwords are encrypted using `bcryptjs` to ensure maximum security.
*   **Flexible File Management:** Offers a full suite of file management capabilities, including uploading, downloading, listing, and deleting files. The API is designed to handle both single and multiple file operations with ease.
*   **Programmatic Access with API Keys:** Allows users to generate and manage API keys for programmatic access to their files. This enables seamless integration with other applications and services.
*   **Scalable AWS S3 Integration:** Leverages the power and scalability of Amazon S3 for secure and reliable file storage. This ensures high availability and durability of your files.
*   **Efficient Bulk Downloads:** Provides the ability to download multiple files as a single, compressed zip archive. This is handled efficiently on the server-side to save bandwidth and improve user experience.
*   **Easy Public File Sharing:** Enables users to share files publicly through a unique and secure URL. This is ideal for sharing files with users who do not have an account on the platform.
*   **Insightful Analytics:** Tracks key metrics related to file uploads and downloads, providing valuable insights into file usage and storage consumption.
*   **Robust Security Measures:** Implements a variety of security best practices, including the use of `helmet` to secure HTTP headers and `cors` to control cross-origin requests. Input validation is strictly enforced using `zod` to prevent common web vulnerabilities.
*   **Comprehensive Logging:** Utilizes a combination of `Winston`, `Logtail`, and `Morgan` for comprehensive and structured logging. This allows for easy monitoring, debugging, and auditing of the application.

## Architecture

The application follows a layered architecture, which separates concerns and promotes modularity and maintainability. The main layers are:

*   **Controllers:** Responsible for handling incoming HTTP requests, validating the request data, and sending the response back to the client.
*   **Services:** Contain the core business logic of the application. They are responsible for interacting with the database and other external services.
*   **Models:** Define the data structure and interact with the MongoDB database using Mongoose.
*   **Routes:** Define the API endpoints and map them to the corresponding controllers.
*   **Middleware:** Provide a way to execute code before the request reaches the route handler. This is used for tasks such as authentication, logging, and error handling.

## Technologies Used

| Category      | Technology                                                                                             | Description                                                                                                                                                                                             |
| :------------ | :--------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Backend**   | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/) | A modern and powerful combination for building fast, scalable, and maintainable server-side applications.                                                                                               |
| **Database**  | [MongoDB](https://www.mongodb.com/), [Mongoose](https://mongoosejs.com/)                                               | A flexible and scalable NoSQL database that is well-suited for handling large amounts of unstructured data. Mongoose provides a simple and elegant way to interact with MongoDB from a Node.js application. |
| **Auth**      | [Passport.js](https://www.passportjs.org/), [JWT](https://jwt.io/)                                                      | A widely-used authentication middleware for Node.js. JWT is used to create secure and stateless authentication tokens.                                                                                  |
| **File Store**| [AWS S3](https://aws.amazon.com/s3/)                                                                                   | A secure, durable, and scalable object storage service from Amazon Web Services.                                                                                                                        |
| **API**       | RESTful API                                                                                                            | A standardized and widely-adopted architectural style for designing networked applications.                                                                                                             |
| **Validation**| [Zod](https://zod.dev/)                                                                                                | A TypeScript-first schema declaration and validation library that helps to ensure data integrity and prevent invalid data from being processed by the application.                                          |
| **Logging**   | [Winston](https://github.com/winstonjs/winston), [Logtail](https://logtail.com/), [Morgan](https://github.com/expressjs/morgan) | A powerful combination for logging in Node.js applications. Winston provides a flexible and extensible logging framework, Logtail is a cloud-based logging service, and Morgan is a HTTP request logger. |

## Getting Started

### Prerequisites

*   Node.js (v18 or higher)
*   npm (v8 or higher) or yarn (v1.22 or higher)
*   A running MongoDB instance (local or cloud-based)
*   An AWS account with an S3 bucket and access credentials

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    ```

2.  **Navigate to the `backend` directory:**

    ```bash
    cd backend
    ```

3.  **Install the dependencies:**

    ```bash
    npm install
    ```

### Configuration

1.  **Create a `.env` file** in the `backend` directory by copying the `.env.example` file:

    ```bash
    cp .env.example .env
    ```

2.  **Update the `.env` file** with your specific configuration:

    ```env
    # AWS Configuration
    AWS_ACCESS_KEY=<your-aws-access-key>
    AWS_SECRET_KEY=<your-aws-secret-key>
    AWS_REGION=<your-aws-region>
    AWS_S3_BUCKET=<your-s3-bucket-name>

    # Logtail Configuration
    LOGTAIL_SOURCE_TOKEN=<your-logtail-source-token>
    LOGTAIL_INGESTING_HOST=<your-logtail-ingesting-host>

    # Application Configuration
    ALLOWED_ORIGINS=http://localhost:3001 # Comma-separated list of allowed origins
    PORT=3000
    NODE_ENV=development # development or production
    BASE_PATH=/api

    # MongoDB Configuration
    MONGODB_PASSWORD=<your-mongodb-password>
    MONGODB_USERNAME=<your-mongodb-username>
    MONGO_URI=mongodb+srv://<userName>:<password>@cluster0.byiiain.mongodb.net/<database>?retryWrites=true&w=majority&appName=Cluster0
    MONGO_DATABASE=<your-mongodb-database-name>

    # JWT Configuration
    JWT_SECRET=<a-strong-and-random-jwt-secret>
    JWT_EXPIRES_IN=1d
    ```

### Running the Application

*   **Development Mode:**

    ```bash
    npm run dev
    ```

    This will start the server using `nodemon`, which automatically restarts the server whenever you make changes to the code. The server will be accessible at `http://localhost:3000`.

*   **Production Mode:**

    ```bash
    npm run build
    npm run start
    ```

    This will first compile the TypeScript code to JavaScript and then start the server. It is recommended to use a process manager like PM2 to run the application in production.

## API Endpoints

All API endpoints are prefixed with `/api`.

### Authentication

| Method | Endpoint       | Description              | Request Body                 | Response                                     |
| :----- | :------------- | :----------------------- | :--------------------------- | :------------------------------------------- |
| `POST` | `/auth/register` | Register a new user      | `name`, `email`, `password`  | `_id`, `name`, `email`, `token`              |
| `POST` | `/auth/login`    | Log in an existing user  | `email`, `password`          | `_id`, `name`, `email`, `token`              |

### Files

*Requires authentication.*

| Method | Endpoint         | Description                     | Request Body                 | Response                                     |
| :----- | :--------------- | :------------------------------ | :--------------------------- | :------------------------------------------- |
| `POST` | `/files/upload`  | Upload one or more files        | `files` (multipart/form-data) | An array of file objects                     |
| `GET`  | `/files`         | Get a list of all user files    | -                            | An array of file objects                     |
| `POST` | `/files/delete`  | Delete one or more files        | `fileIds` (array of strings) | `deletedCount`, `failedCount`                |
| `POST` | `/files/download`| Get a download URL for files    | `fileIds` (array of strings) | `downloadUrl`, `isZip`                       |

### API Keys

*Requires authentication.*

| Method   | Endpoint        | Description               | Request Body | Response                                     |
| :------- | :-------------- | :------------------------ | :----------- | :------------------------------------------- |
| `POST`   | `/api-keys`     | Create a new API key      | -            | The newly created API key                    |
| `GET`    | `/api-keys`     | Get all user API keys     | -            | An array of API key objects                  |
| `DELETE` | `/api-keys/:id` | Delete an API key         | -            | A success message                            |

### Public

| Method | Endpoint         | Description              | Request Body | Response                                     |
| :----- | :--------------- | :----------------------- | :----------- | :------------------------------------------- |
| `GET`  | `/file/:fileId`  | Get a publicly shared file | -            | The file stream                              |

## Error Handling

The application uses a centralized error handling middleware to catch and handle all errors. Errors are classified into different types based on their status code and are returned in a consistent JSON format:

```json
{
  "status": "error",
  "statusCode": 500,
  "message": "Internal Server Error",
  "errors": []
}
```

## Project Structure

```
backend/
├── src/
│   ├── config/         # Configuration files for database, AWS S3, passport, etc.
│   ├── constant/       # Application-wide constants.
│   ├── controllers/    # Express route handlers that interact with services.
│   ├── enum/           # Enumerations used throughout the application.
│   ├── middleware/     # Custom Express middleware for authentication, error handling, etc.
│   ├── models/         # Mongoose models that define the database schemas.
│   ├── routes/         # Express routes that define the API endpoints.
│   ├── schemas/        # Zod schemas for validating request data.
│   ├── services/       # Core business logic of the application.
│   ├── types/          # TypeScript type definitions.
│   └── utils/          # Utility functions and helper classes.
├── .env                # Environment variables (should not be committed to version control).
├── package.json        # Project dependencies and scripts.
└── tsconfig.json       # TypeScript compiler options.
```
