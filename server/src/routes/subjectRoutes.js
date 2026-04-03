const express = require("express");
const { body } = require("express-validator");
const {
  listSubjects,
  createSubject,
  updateSubject,
  deleteSubject
} = require("../controllers/subjectController");
const { handleValidation } = require("../middleware/validate");

const router = express.Router();

router.get("/", listSubjects);
router.post(
  "/",
  [body("name").notEmpty().withMessage("Subject name is required"), handleValidation],
  createSubject
);
router.put("/:id", updateSubject);
router.delete("/:id", deleteSubject);

module.exports = router;
