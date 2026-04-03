const express = require("express");
const { body } = require("express-validator");
const { listTasks, createTask, updateTask, deleteTask } = require("../controllers/taskController");
const { handleValidation } = require("../middleware/validate");

const router = express.Router();

router.get("/", listTasks);
router.post(
  "/",
  [
    body("subject").notEmpty().withMessage("Subject is required"),
    body("title").notEmpty().withMessage("Title is required"),
    body("dueDate").isISO8601().withMessage("Valid due date is required"),
    body("estimatedMinutes").isInt({ min: 15 }).withMessage("Estimated minutes must be at least 15"),
    handleValidation
  ],
  createTask
);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

module.exports = router;
