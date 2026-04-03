const dayjs = require("dayjs");

const scoreTask = (task) => {
  const dueInHours = Math.max(dayjs(task.dueDate).diff(dayjs(), "hour", true), 1);
  const urgencyScore = 100 / dueInHours;
  const priorityScore = task.priority * 15;
  return urgencyScore + priorityScore;
};

const generateSchedule = (tasks, hoursPerDay) => {
  const minutesPerDay = hoursPerDay * 60;
  const sorted = [...tasks].sort((a, b) => scoreTask(b) - scoreTask(a));

  const schedule = [];
  let cursor = dayjs().hour(6).minute(0).second(0).millisecond(0);
  let remainingToday = minutesPerDay;

  for (const task of sorted) {
    let remainingTask = task.estimatedMinutes;

    while (remainingTask > 0) {
      if (remainingToday <= 0) {
        cursor = cursor.add(1, "day").hour(6).minute(0);
        remainingToday = minutesPerDay;
      }

      const chunk = Math.min(remainingTask, remainingToday, 120);

      const start = cursor;
      const end = cursor.add(chunk, "minute");

      schedule.push({
        taskId: task._id,
        title: task.title,
        subject: task.subject?.name || "General",
        start: start.toISOString(),
        end: end.toISOString(),
        durationMinutes: chunk,
        priority: task.priority
      });

      remainingTask -= chunk;
      remainingToday -= chunk;
      cursor = end.add(10, "minute");
    }
  }

  return schedule;
};

module.exports = { generateSchedule };
