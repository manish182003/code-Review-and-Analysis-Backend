const { validationResult, body } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array() });
  }
  next();
};

const registerValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is Required.")
    .isEmail()
    .withMessage("Invalid Email Format.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("password")
    .notEmpty()
    .withMessage("Password is Required.")
    .isLength({ min: 8 })
    .withMessage("Password Must Be At least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[!@#$%^&*]/)
    .withMessage("Password must contain at least one special character"),
  validate,
];

const loginValidator = [
  body("email")
    .notEmpty()
    .withMessage("Email is Required.")
    .isEmail()
    .withMessage("Invalid Email Format.")
    .normalizeEmail({ gmail_remove_dots: false }),
  body("password").notEmpty().withMessage("Password is Required."),
  validate,
];

module.exports = { loginValidator, registerValidator };
