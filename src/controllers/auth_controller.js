const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../../connection/send_email");
const path = require("path");

const registerNewUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "Email Already Exist." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const newUser = new userModel({
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    // Send email with verification link
    const verifyUrl = `${process.env.URL}/api/auth/verify-email/${verificationToken}`;
    const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to Our App 🎉</h2>
      <p>Thanks for signing up! Please click the button below to verify your email:</p>
      <a href="${verifyUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 10px;
      ">Verify Email</a>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <hr style="margin-top: 20px;">
      <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</p>
    </div>
  `;
    await sendEmail(email, "Verify Your Email", html);

    return res
      .status(201)
      .json({ success: true, message: "User Register Successfully." });
  } catch (e) {
    console.log(e.message);
    return res.status(500).json({ success: false, error: e.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await userModel.findOne({ verificationToken: token });
    if (!user) {
      return res
        .status(400)
        .sendFile(path.join(__dirname, "../views/error.html"));
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    return res
      .status(200)
      .sendFile(path.join(__dirname, "../views/success.html"));
  } catch (e) {
    return res
      .status(500)
      .sendFile(path.join(__dirname, "../views/error.html"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await userModel.findOne({ email });
    if (!existingUser) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials." });
    }

    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, error: "Invalid Credentials." });
    }

    if (!existingUser.isVerified) {
      const verificationToken = crypto.randomBytes(32).toString("hex");

      existingUser.verificationToken = verificationToken;

      await existingUser.save();

      // Send email with verification link
      const verifyUrl = `${process.env.URL}/api/auth/verify-email/${verificationToken}`;
      const html = `
    <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9; color: #333;">
      <h2 style="color: #4CAF50;">Welcome to Our App 🎉</h2>
      <p>Thanks for signing up! Please click the button below to verify your email:</p>
      <a href="${verifyUrl}" style="
        display: inline-block;
        padding: 10px 20px;
        background-color: #4CAF50;
        color: white;
        text-decoration: none;
        border-radius: 5px;
        margin-top: 10px;
      ">Verify Email</a>
      <p>If you did not create an account, you can safely ignore this email.</p>
      <hr style="margin-top: 20px;">
      <p style="font-size: 12px; color: #777;">This is an automated message. Please do not reply.</p>
    </div>
  `;
      await sendEmail(email, "Verify Your Email", html);
      return res
        .status(401)
        .json({ success: false, error: "Please verify your email to login" });
    }

    const JWT_SECRET = process.env.JWT_SECRET;

    const token = jwt.sign(
      { userId: existingUser._id, email: existingUser.email },
      JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.status(200).json({
      success: true,
      message: "User Successfully logged In",
      token: token,
      data: {
        id: existingUser._id,
        email: existingUser.email,
      },
    });
  } catch (e) {
    return res.status(500).json({ success: false, error: e.message });
  }
};

const getUserData = async (req, res) => {
  if (req.user) {
    return res.status(200).json({
      success: true,
      data: {
        id: req.user._id,
        email: req.user.email,
      },
    });
  } else {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
};

module.exports = { registerNewUser, loginUser, getUserData, verifyEmail };
