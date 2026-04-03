const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    difficulty: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    targetExamDate: {
      type: Date,
      required: false
    },
    weeklyGoalHours: {
      type: Number,
      default: 6,
      min: 1,
      max: 70
    },
    color: {
      type: String,
      default: "#1E88E5"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Subject", subjectSchema);
