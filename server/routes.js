const express = require("express");
const router = express.Router();
const authenticate = require("./middleware/auth");

const authRoutes = require("./features/auth");
const processRoutes = require("./features/process/process.routes"); // Added
const headingRoutes = require("./features/resume/heading");
const skillRoutes = require("./features/resume/skill");
const projectRoutes = require("./features/resume/project");
const achievementRoutes = require("./features/resume/achievement");
const certificationRoutes = require("./features/resume/certification");
const educationRoutes = require("./features/resume/education");
const experienceRoutes = require("./features/resume/experience");

router.use("/auth", authRoutes);
router.use("/process", authenticate, processRoutes); // Added

router.use("/resume", authenticate);
router.use("/resume/heading", headingRoutes);
router.use("/resume/skills", skillRoutes);
router.use("/resume/projects", projectRoutes);
router.use("/resume/achievements", achievementRoutes);
router.use("/resume/certifications", certificationRoutes);
router.use("/resume/education", educationRoutes);
router.use("/resume/experiences", experienceRoutes);

module.exports = router;
