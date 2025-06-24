const { multerUpload } = require("../middleware/upload");
const ai_service = require("../services/ai_service");
const fs = require("fs");

const analyzeProgramComplexity = async (req, res) => {
  try {
    let combinedCode = "";
    const { code } = req.body;

    // Validate that at least file or code is present
    if (!req.file && !code) {
      return res.status(400).json({
        success: false,
        error: "No code or file provided for review.",
      });
    }

    if (req.file) {
      const fileContent = fs.readFileSync(req.file.path, "utf-8");
      fs.unlinkSync(req.file.path); // cleanup
      combinedCode += `// --- File: ${req.file.originalname} ---\n${fileContent}\n`;
    }

    if (req.file && code) {
      combinedCode += `\n// --- Additional Code Snippet ---\n${code}`;
    }

    const finalCode = req.file ? combinedCode : code;
    const result = await ai_service.analyzeCodeComplexity(finalCode);

    if (result.success) {
      return res.status(200).json({
        success: true,
        data: result.review,
        timestamps: result.timestamp,
      });
    } else {
      return res.status(400).json({
        success: false,
        error: result.error,
        details: result.details,
      });
    }
  } catch (err) {
    const statusCode = err.status || 500;
    return res.status(statusCode).json({
      success: false,
      error: err.error || err.message || "Internal Server Error",
    });
  }
};

module.exports = analyzeProgramComplexity;
