const Subject = require("../models/Subject");

const listSubjects = async (req, res, next) => {
  try {
    const subjects = await Subject.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(subjects);
  } catch (error) {
    next(error);
  }
};

const createSubject = async (req, res, next) => {
  try {
    const subject = await Subject.create({ ...req.body, user: req.user._id });
    res.status(201).json(subject);
  } catch (error) {
    next(error);
  }
};

const updateSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json(subject);
  } catch (error) {
    next(error);
  }
};

const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!subject) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { listSubjects, createSubject, updateSubject, deleteSubject };
