const express = require("express");
const { validateCodeInput } = require("../middleware/validateCode");
const generateProgramDocumentation = require("../controllers/generate_doc_controller");
const { multerUploadMiddleware, upload } = require("../middleware/upload");

const docRouter = express.Router();

docRouter.post(
  "/code/generateDoc",
  upload.single("file"),
  validateCodeInput,
  generateProgramDocumentation
);

module.exports = docRouter;
