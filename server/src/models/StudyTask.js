const mongoose = require("mongoose");

const studyTaskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },
    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    dueDate: {
      type: Date,
      required: true
    },
    estimatedMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 720
    },
    priority: {
      type: Number,
      default: 3,
      min: 1,
      max: 5
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed"],
      default: "pending"
    },
    scheduledFor: {
      type: Date,
      required: false
    },
    completedAt: {
      type: Date,
      required: false
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudyTask", studyTaskSchema);
