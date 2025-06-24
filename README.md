# Code Review and Analysis Backend

![Node.js](https://img.shields.io/badge/Node.js-v20-brightgreen) ![MongoDB](https://img.shields.io/badge/MongoDB-v7-blue) ![Express](https://img.shields.io/badge/Express-v5-orange) ![Cohere AI](https://img.shields.io/badge/Cohere%20AI-v7-purple)

Welcome to the backend of the **Code Review and Analysis** project! This Node.js-based backend powers a robust platform for code review, documentation generation, and code complexity analysis using AI. It features secure authentication, rate limiting, file uploads, and integration with Cohere AI for intelligent code analysis.

## 🚀 Features

- **Code Review**: AI-powered code review with actionable feedback.
- **Documentation Generation**: Automatically generate markdown documentation for code files.
- **Code Complexity Analysis**: Analyze code complexity using AI-driven insights.
- **Authentication**: JWT-based auth with guest access (3 free requests).
- **Rate Limiting**: Prevents abuse with `express-rate-limit`.
- **File Uploads**: Secure single-file uploads using `multer`.
- **AI Integration**: Powered by Cohere AI for intelligent code processing.
- **Security**: Includes `helmet`, `cors`, and `bcryptjs` for secure operations.
- **Error Handling**: Comprehensive error management for robust API responses.

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (via Mongoose)
- **AI**: Cohere AI
- **Auth**: JSON Web Tokens (JWT), bcryptjs
- **Middleware**: CORS, Morgan, Helmet, Express Rate Limit
- **File Handling**: Multer
- **Others**: Nodemailer, dotenv

## 📂 Project Structure

```plaintext
├── server.js              # Entry point
├── package.json           # Dependencies and scripts
├── .env                   # Environment variables
├── routes/                # API routes
├── controllers/           # Request handlers
├── models/                # MongoDB schemas
├── middleware/            # Custom middleware (auth, rate-limit, etc.)
└── utils/                 # Utility functions
```

## 🧰 Prerequisites

- Node.js (v20 or higher)
- MongoDB (local or cloud instance)
- Cohere AI API key
- Environment variables (see `.env.example`)

## ⚙️ Setup Instructions

1. **Clone the repository**:

   ```bash
   git clone <repository-url>
   cd code-review-backend
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory and add:

   ```plaintext
   PORT=3000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-jwt-secret>
   COHERE_API_KEY=<your-cohere-api-key>
   ```

4. **Run the server**:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` (or the specified `PORT`).

## 📡 API Endpoints

| Method | Endpoint           | Description             | Auth Required  |
| ------ | ------------------ | ----------------------- | -------------- |
| POST   | `/auth/register`   | Register a new user     | No             |
| POST   | `/auth/login`      | Login and get JWT       | No             |
| POST   | `/code/review`     | Submit code for review  | Yes (or guest) |
| POST   | `/code/docs`       | Generate documentation  | Yes (or guest) |
| POST   | `/code/complexity` | Analyze code complexity | Yes (or guest) |

**Guest Access**: Limited to 3 requests without authentication.

## 🔐 Rate Limiting

- **Authenticated Users**: Configurable limits per user.
- **Guest Users**: 3 requests per session.

## 🤖 AI Prompts

The backend uses Cohere AI with tailored prompts to:

- Perform code reviews with suggestions.
- Generate markdown-based documentation.
- Analyze code complexity metrics.

## 🐛 Error Handling

- Validation errors (via `express-validator`).
- File upload errors (size, format, etc.).
- API rate limit errors.
- Authentication/authorization errors.

## 📝 License

This project is licensed under the [ISC License](LICENSE).

## 📧 Contact

For questions or feedback, reach out via [email](mailto:your-email@example.com) or open an issue in the repository.

---

Happy coding! 🚀
