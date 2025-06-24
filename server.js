const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
const dotenv = require("dotenv");
const { createServer } = require("http");
const cors = require("cors");

const reviewRouter = require("./src/routes/code_review");
const docRouter = require("./src/routes/generate_documentation");
const analyzeCodeRouter = require("./src/routes/analyze_code");
const usageLimiter = require("./src/middleware/usageLimiter");

const connectDB = require("./connection/db.js");
const authRouter = require("./src/routes/auth_route.js");

dotenv.config();

const app = express();

//middleware
app.use(helmet());
app.use(cors());
app.use(morgan("combined"));
app.use((req, res, next) => {
  console.log("request comming->", req.body);
  if (req.is("application/json")) {
    express.json()(req, res, next);
  } else {
    next();
  }
});

app.use("/api/user/review", usageLimiter, reviewRouter);
app.use("/api/user/doc", usageLimiter, docRouter);
app.use("/api/user/analysis", usageLimiter, analyzeCodeRouter);
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  console.error(err.stack);
  if (err.code === "LIMIT_FIELD_SIZE") {
    return res.status(400).json({
      success: false,
      error: "Field size too large. Max 2MB allowed.",
    });
  }

  if (err.code === "UNSUPPORTED_FILE_TYPE") {
    return res.status(400).json({
      success: false,
      error: "Only code files with supported extensions are allowed.",
    });
  }

  // Other unknown errors
  return res.status(500).json({
    success: false,
    error: err.message || "Something went wrong",
  });
});

connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is Running on Port ${PORT}`);
});
