const StudyTask = require("../models/StudyTask");
const User = require("../models/User");
const { generateSchedule } = require("../services/schedulerService");

const getSchedule = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    const tasks = await StudyTask.find({
      user: req.user._id,
      status: { $ne: "completed" }
    }).populate("subject", "name color");

    const schedule = generateSchedule(tasks, user.preferences.dailyStudyHours);

    res.json({
      dailyStudyHours: user.preferences.dailyStudyHours,
      sessions: schedule
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSchedule };
