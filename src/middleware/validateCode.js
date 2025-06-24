const validateCodeInput = (req, res, next) => {
  console.log(req.body);
  console.log(req.file);
  const { code } = req.body;

  if ((!code || typeof code !== "string") && !req.file) {
    return res.status(400).json({
      success: false,
      error: "Code is required and must be a string",
    });
  }

  if (code && code.length > 50000) {
    return res.status(400).json({
      success: false,
      error: "Code exceeds maximum length of 50,000 characters",
    });
  }

  // if (!language || typeof language !== "string") {
  //   return res.status(400).json({
  //     success: false,
  //     error: "Language is required and must be a string",
  //   });
  // }

  // const supportedLanguages = [
  //   "javascript",
  //   "typescript",
  //   "python",
  //   "java",
  //   "dart",
  //   "flutter",
  //   "c++",
  //   "c#",
  //   "go",
  //   "rust",
  //   "php",
  //   "swift",
  //   "kotlin",
  //   "ruby",
  // ];

  // if (!supportedLanguages.includes(language.toLowerCase())) {
  //   return res.status(400).json({
  //     success: false,
  //     error: `Language '${language}' is not supported`,
  //     supportedLanguages,
  //   });
  // }

  next();
};

module.exports = { validateCodeInput };
