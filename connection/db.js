const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL).then((message) => {
      console.log("MongoDB Connected ");
    });
  } catch (e) {
    console.error("MogoDB Connection Failed: ", e.message);
    process.exit(1);
  }
};

module.exports = connectDB;
