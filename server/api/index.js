require("dotenv").config();

const connectDB = require("../src/config/db");
const app = require("../src/app");

connectDB().catch((error) => {
  console.error("Unable to connect to MongoDB:", error);
});

module.exports = app;
