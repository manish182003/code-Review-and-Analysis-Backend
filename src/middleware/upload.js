const multer = require("multer");
const path = require("path");

const upload = multer({
  dest: "uploads/",
  limits: { fieldSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedExtensions = [
      ".js",
      ".py",
      ".cpp",
      ".java",
      ".ts",
      ".dart",
      ".html",
      ".css",
    ];
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      const error = new Error("Only Code Files are allowed.");
      error.code = "UNSUPPORTED_FILE_TYPE"; // Custom error code
      return cb(error, false);
    }
    cb(null, true);
  },
});

module.exports = { upload };
