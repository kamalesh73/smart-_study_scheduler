const StudyTask = require("../models/StudyTask");

const listTasks = async (req, res, next) => {
  try {
    const status = req.query.status;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const tasks = await StudyTask.find(filter)
      .populate("subject", "name color")
      .sort({ dueDate: 1, priority: -1 });

    res.json(tasks);
  } catch (error) {
    next(error);
  }
};

const createTask = async (req, res, next) => {
  try {
    const task = await StudyTask.create({ ...req.body, user: req.user._id });
    const populated = await task.populate("subject", "name color");
    res.status(201).json(populated);
  } catch (error) {
    next(error);
  }
};

const updateTask = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    if (payload.status === "completed") {
      payload.completedAt = new Date();
    }

    const task = await StudyTask.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      payload,
      { new: true }
    ).populate("subject", "name color");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const task = await StudyTask.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json({ message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listTasks, createTask, updateTask, deleteTask };
