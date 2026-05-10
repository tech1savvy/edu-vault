"use strict";

const express = require("express");
const authenticate = require("../middleware/auth");
const interviewController = require("../controllers/interviewController");

const router = express.Router();

router.use(authenticate);

router.get("/domain-detection", interviewController.detectDomains);
router.get("/questions/:domain", interviewController.getQuestions);
router.post("/submit", interviewController.submitInterview);
router.get("/result/:id", interviewController.getResult);

module.exports = router;
