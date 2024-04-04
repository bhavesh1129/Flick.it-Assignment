const mongoose = require("mongoose");
require("dotenv").config();

const DBConnection = async () => {
  const MONGO_URI = process.env.MONGO_URL;
  try {
    await mongoose.connect(MONGO_URI);
    console.log("DB connection established!");
  } catch (error) {
    console.log("Error while connecting to MongoDB ", error.message);
  }
};

module.exports = { DBConnection };