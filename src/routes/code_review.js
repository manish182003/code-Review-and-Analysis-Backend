const express = require("express");

const { validateCodeInput } = require("../middleware/validateCode");
const {
  suggestedProgramCodeFixes,
  reviewProgramCode,
} = require("../controllers/code_review_controller");
const { multerUploadMiddleware, upload } = require("../middleware/upload");

const reviewRouter = express.Router();

reviewRouter.post(
  "/code/review",
  upload.single("file"),
  validateCodeInput,
  reviewProgramCode
);

reviewRouter.post(
  "/code/fixes",
  upload.single("file"),
  validateCodeInput,
  suggestedProgramCodeFixes
);
module.exports = reviewRouter;
