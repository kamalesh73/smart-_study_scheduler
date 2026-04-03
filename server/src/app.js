const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

const { protect } = require("./middleware/auth");
const { errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const subjectRoutes = require("./routes/subjectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const insightRoutes = require("./routes/insightRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "smart-study-scheduler-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/subjects", protect, subjectRoutes);
app.use("/api/tasks", protect, taskRoutes);
app.use("/api/schedule", protect, scheduleRoutes);
app.use("/api/insights", protect, insightRoutes);

app.use(errorHandler);

module.exports = app;
