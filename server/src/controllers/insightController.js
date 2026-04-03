const dayjs = require("dayjs");
const StudyTask = require("../models/StudyTask");
const Subject = require("../models/Subject");

const getInsights = async (req, res, next) => {
  try {
    const now = dayjs();
    const weekStart = now.startOf("week").toDate();

    const [allTasks, weekCompleted, subjects] = await Promise.all([
      StudyTask.find({ user: req.user._id }).populate("subject", "name"),
      StudyTask.countDocuments({
        user: req.user._id,
        status: "completed",
        completedAt: { $gte: weekStart }
      }),
      Subject.find({ user: req.user._id })
    ]);

    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter((task) => task.status === "completed").length;
    const pendingTasks = totalTasks - completedTasks;

    const completionRate = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    const hoursCompleted = Math.round(
      allTasks
        .filter((task) => task.status === "completed")
        .reduce((acc, task) => acc + task.estimatedMinutes, 0) / 60
    );

    const subjectBreakdown = subjects.map((subject) => {
      const subjectTasks = allTasks.filter(
        (task) => task.subject && task.subject._id.toString() === subject._id.toString()
      );
      const done = subjectTasks.filter((t) => t.status === "completed").length;

      return {
        subject: subject.name,
        total: subjectTasks.length,
        completed: done,
        progress: subjectTasks.length ? Math.round((done / subjectTasks.length) * 100) : 0
      };
    });

    res.json({
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      hoursCompleted,
      weekCompleted,
      subjectBreakdown
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getInsights };
