const express = require("express");

const {
  registerNewUser,
  loginUser,
  getUserData,
  verifyEmail,
} = require("../controllers/auth_controller");
const { registerLimiter, loginLimiter } = require("../middleware/rate_limiter");
const {
  registerValidator,
  loginValidator,
} = require("../middleware/validator");
const usageLimiter = require("../middleware/usageLimiter");
const authRouter = express.Router();

authRouter.post(
  "/register",
  registerLimiter,
  registerValidator,
  registerNewUser
);
authRouter.post("/login", loginLimiter, loginValidator, loginUser);

authRouter.get("/user/get-data", usageLimiter, getUserData);
authRouter.get("/verify-email/:token", verifyEmail);

module.exports = authRouter;
