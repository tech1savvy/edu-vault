"use strict";

const express = require("express");
const authenticate = require("../middleware/auth");
const interviewController = require("../controllers/interviewController");

const router = express.Router();

router.use(authenticate);

router.get("/domain-detection", interviewController.detectDomains);
router.post("/start", interviewController.startWrittenInterview);
router.post("/question", interviewController.nextQuestion);
router.post("/evaluate", interviewController.evaluateAnswer);
router.post("/end", interviewController.endInterview);
router.get("/:id/report", interviewController.getInterviewReport);

module.exports = router;
