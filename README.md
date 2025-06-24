# Code Review and Analysis Backend

![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen?logo=node.js) ![MongoDB](https://img.shields.io/badge/MongoDB-v7-blue?logo=mongodb) ![Express](https://img.shields.io/badge/Express-v5-orange?logo=express) ![Cohere AI](https://img.shields.io/badge/Cohere%20AI-v7-purple) ![JWT](https://img.shields.io/badge/JWT-v9-green)

Welcome to the backend of the **Code Review and Analysis** project! This Node.js-based backend powers a robust platform for AI-driven code review, documentation generation, and code complexity analysis. Built with Express.js and MongoDB, it integrates Cohere AI for intelligent code processing, supports secure JWT-based authentication with guest access, and includes features like rate limiting, file uploads, and comprehensive error handling.

## :rocket: Features

- **Code Review**: AI-powered analysis of code with actionable feedback and improvement suggestions.
- **Documentation Generation**: Automatically generate markdown-based documentation for uploaded code files.
- **Code Complexity Analysis**: Evaluate code complexity using AI-driven metrics (e.g., cyclomatic complexity, maintainability).
- **Authentication**: JWT-based login/register with guest access limited to 3 free requests per session.
- **Rate Limiting**: Prevents abuse with configurable limits using `express-rate-limit`.
- **File Uploads**: Secure single-file uploads (code files) using `multer` with size and format validation.
- **AI Integration**: Leverages Cohere AI with custom prompts for code analysis, documentation, and reviews.
- **Security**: Enhanced with `helmet` (security headers), `cors` (cross-origin requests), and `bcryptjs` (password hashing).
- **Error Handling**: Comprehensive handling of validation, file, auth, and API errors with meaningful responses.
- **Logging**: Request logging with `morgan` for debugging and monitoring.
- **Email Notifications**: Supports user notifications (e.g., registration confirmation) via `nodemailer`.

## :wrench: Tech Stack

- **Runtime**: Node.js (v20+)
- **Framework**: Express.js (v5)
- **Database**: MongoDB (v7, via Mongoose)
- **AI**: Cohere AI (v7)
- **Authentication**: JSON Web Tokens (JWT), bcryptjs
- **Middleware**:
  - `cors`: Cross-origin resource sharing
  - `morgan`: HTTP request logging
  - `helmet`: Security headers
  - `express-rate-limit`: API rate limiting
  - `express-validator`: Input validation
- **File Handling**: Multer (for file uploads)
- **Utilities**:
  - `dotenv`: Environment variable management
  - `nodemailer`: Email notifications
  - `crypto`: Additional security utilities
  - `path`: File path handling
- **Development**: `nodemon` (auto-restart on changes)

## :open_file_folder: Project Structure

```
├── server.js              # Entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── routes/
│   ├── auth.js            # Authentication routes (login, register)
│   ├── code.js            # Code review, doc, and complexity routes
├── controllers/
│   ├── authController.js  # Auth logic
│   ├── codeController.js  # Code processing logic
├── models/
│   ├── User.js            # User schema (MongoDB)
│   ├── CodeRequest.js     # Code request tracking
├── middleware/
│   ├── auth.js            # JWT authentication
│   ├── rateLimit.js       # Rate limiting logic
│   ├── validate.js        # Input validation
├── utils/
│   ├── cohere.js          # Cohere AI integration
│   ├── fileHandler.js     # File upload utilities
│   ├── errorHandler.js    # Centralized error handling
│   ├── email.js           # Nodemailer utilities
```

## :gear: Prerequisites

- **Node.js**: v20 or higher
- **MongoDB**: Local or cloud instance (e.g., MongoDB Atlas)
- **Cohere AI API Key**: Obtain from [Cohere dashboard](https://dashboard.cohere.ai/)
- **Environment Variables**: Configured in `.env`
- **Optional**: SMTP service (e.g., Gmail) for `nodemailer`

## :computer: Setup Instructions

1. **Clone the Repository**:

   ```bash
   git clone <repository-url>
   cd code-review-backend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Set Up Environment Variables**:
   Create a `.env` file in the root directory:

   ```
   PORT=3000
   MONGO_URI=mongodb://localhost:27017/code-review
   JWT_SECRET=your-secret-key
   COHERE_API_KEY=your-cohere-api-key
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-email-password
   ```

   - Replace `MONGO_URI` with your MongoDB connection string.
   - Generate a secure `JWT_SECRET` (e.g., using `crypto.randomBytes`).
   - Obtain `COHERE_API_KEY` from Cohere.
   - Configure SMTP credentials for `nodemailer` (optional).

4. **Run the Server**:
   ```bash
   npm start
   ```
   The server runs on `http://localhost:5000` (or the specified `PORT`).

## :globe_with_meridians: API Endpoints

| Method | Endpoint           | Description                     | Auth Required  | Rate Limit                      |
| ------ | ------------------ | ------------------------------- | -------------- | ------------------------------- |
| POST   | `/auth/register`   | Register a new user             | No             | 10/min                          |
| POST   | `/auth/login`      | Login and get JWT token         | No             | 10/min                          |
| POST   | `/code/review`     | Submit code for AI review       | Yes (or guest) | 5/min (auth), 3/session (guest) |
| POST   | `/code/docs`       | Generate markdown documentation | Yes (or guest) | 5/min (auth), 3/session (guest) |
| POST   | `/code/complexity` | Analyze code complexity         | Yes (or guest) | 5/min (auth), 3/session (guest) |

- **Request Format** (for code endpoints):
  ```json
  {
    "file": "<uploaded-file>",
    "language": "javascript" // e.g., javascript, python, etc.
  }
  ```
- **Response Format**:
  ```json
  {
    "success": true,
    "data": {
      "result": "AI-generated markdown or analysis",
      "type": "review|docs|complexity"
    }
  }
  ```

## :lock: Authentication Flow

- **Register**: Users provide email and password; password is hashed with `bcryptjs`.
- **Login**: Returns a JWT token (valid for 8 hours) stored in client-side `flutter_secure_storage`.
- **Guest Access**: Allows 3 free requests per session, tracked via `CodeRequest` model in MongoDB.
- **Protected Routes**: Use `auth.js` middleware to verify JWT tokens.
- **Token Expiry**: Tokens expire after 8 hours, requiring re-authentication.

## :robot: AI Integration

- **Cohere AI**: Used for:
  - **Code Review**: Generates suggestions for code improvements (e.g., readability, bugs, best practices).
  - **Documentation**: Produces markdown documentation with function/class descriptions.
  - **Complexity Analysis**: Calculates metrics like cyclomatic complexity and maintainability index.
- **Prompt Engineering**:
  - Custom prompts are defined in `utils/cohere.js` for each feature.
  - Example prompt for code review:
    ```
    Analyze the following {language} code for errors, performance issues, and best practices. Provide detailed feedback in markdown format: {code}
    ```
- **Optimization**: Responses are cached in MongoDB to reduce API calls and improve performance.

## :shield: Rate Limiting

- **Authenticated Users**: 5 requests per minute per endpoint (configurable in `middleware/rateLimit.js`).
- **Guest Users**: 3 requests per session (tracked via IP or session ID).
- **Implementation**: Uses `express-rate-limit` with MongoDB store for persistence.
- **Error Response**:
  ```json
  {
    "success": false,
    "error": "Too many requests, please try again later."
  }
  ```

## :open_book: File Uploads

- **Handler**: `multer` middleware for single-file uploads.
- **Validation**:
  - File size: Max 2MB.
  - File types: `.js`, `.py`, `.java`, `.cpp`, etc. (configurable in `utils/fileHandler.js`).
  - Ensures file is valid code before processing.
- **Storage**: Temporary storage on server; deleted after processing.
- **Error Handling**: Returns specific errors for invalid files (e.g., size, format).

## :bug: Error Handling

- **Centralized**: Handled in `utils/errorHandler.js` with custom error middleware.
- **Types**:
  - **Validation Errors**: Invalid input (e.g., missing fields) via `express-validator`.
  - **File Errors**: Invalid file type, size, or upload failures.
  - **Auth Errors**: Invalid/expired JWT or unauthorized access.
  - **API Errors**: Cohere AI failures, MongoDB issues, or server errors.
- **Response Format**:
  ```json
  {
    "success": false,
    "error": "Detailed error message",
    "code": 400 // HTTP status code
  }
  ```

## :mag: Logging

- **Morgan**: Logs HTTP requests (method, URL, status, response time) to console and file (`logs/access.log`).
- **Custom Logging**: Errors and critical events logged in `utils/errorHandler.js` for debugging.

## :email: Email Notifications

- **Nodemailer**: Sends emails for:
  - User registration confirmation.
  - Password reset (if implemented).
- **Configuration**: SMTP settings in `.env` (e.g., Gmail, SendGrid).
- **Error Handling**: Graceful fallback if email service fails.

## :test_tube: Testing

- **Unit Tests**:
  - Test controllers (`authController.js`, `codeController.js`) with mocked MongoDB and Cohere API.
  - Validate JWT generation and verification.
- **Integration Tests**:
  - Test API endpoints with tools like `supertest`.
  - Verify rate limiting and file upload functionality.
- **Setup**:
  - Add test script to `package.json`:
    ```json
    "test": "jest --config jest.config.js"
    ```
  - Install dependencies:
    ```bash
    npm install --save-dev jest supertest
    ```
  - Run tests:
    ```bash
    npm test
    ```

## :rocket: Performance Optimizations

- **MongoDB**: Indexes on `User` and `CodeRequest` collections for faster queries.
- **Caching**: Stores AI responses in MongoDB to reduce Cohere API calls.
- **Rate Limiting**: Prevents server overload.
- **Multer**: In-memory file handling to minimize disk I/O.

## :bulb: Future Improvements

- Add support for multiple file uploads.
- Implement WebSocket for real-time AI processing updates.
- Add Redis for caching and session management.
- Enhance test coverage with end-to-end tests.
- Support additional AI providers (e.g., OpenAI, Hugging Face).
- Add API versioning for backward compatibility.

## :page_facing_up: License

Licensed under the [ISC License](LICENSE).

## :envelope: Contact

For questions or feedback, open an issue in the repository or email [manishjoshi182003@gmail.com](mailto:manishjoshi182003@gmail.com).

## :star: Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit changes (`git commit -m "Add YourFeature"`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

---

Happy coding! :rocket:
