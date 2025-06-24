const express = require("express");
const { validateCodeInput } = require("../middleware/validateCode");
const analyzeProgramComplexity = require("../controllers/analyze_code_controller");
const { multerUploadMiddleware, upload } = require("../middleware/upload");

const analyzeCodeRouter = express.Router();

analyzeCodeRouter.post(
  "/code/analysis-complexity",
  upload.single("file"),
  validateCodeInput,
  analyzeProgramComplexity
);
module.exports = analyzeCodeRouter;
