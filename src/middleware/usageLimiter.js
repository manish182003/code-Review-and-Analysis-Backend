const jwt = require("jsonwebtoken");
const guestModel = require("../models/guestModel");
const userModel = require("../models/userModel");

const usageLimiter = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  const deviceId = req.headers["x-device-id"];
  const JWT_SECRET = process.env.JWT_SECRET;
  if (token && token !== "null" && token !== "undefined") {
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await userModel.findById(decoded.userId);
      if (!user) {
        throw new Error();
      }

      req.user = user;
      return next();
    } catch (e) {
      console.error(`error-> ${e.message}`);
      if (e.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error: "Token expired",
          tokenExpired: true,
          redirectRoute: "/auth/login",
        });
      }
      return res.status(401).json({ success: false, error: "Invalid Token" });
    }
  }

  if (!deviceId)
    return res.status(400).json({ success: false, error: "Device ID missing" });

  const guest = await guestModel.findOne({ deviceId });
  if (!guest) {
    await guestModel.create({ deviceId, usageCount: 1 });
    return next();
  }

  if (guest.usageCount >= 3) {
    return res.status(403).json({
      success: false,
      error: "Login required after 3 uses",
      redirect: "/auth/login",
    });
  }

  guest.usageCount += 1;
  guest.lastUsedAt = new Date();
  await guest.save();
  next();
};

module.exports = usageLimiter;
