const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: true
    },
    preferences: {
      dailyStudyHours: {
        type: Number,
        default: 3,
        min: 1,
        max: 12
      },
      focusSessionMinutes: {
        type: Number,
        default: 50
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
