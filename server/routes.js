const express = require("express");
const router = express.Router();
const authenticateToken = require("./middleware/auth");

const authRoutes = require("./features/auth");
const { getFullResume } = require("./features/resume/resume.controller");
const headingRoutes = require("./features/resume/heading");
const skillRoutes = require("./features/resume/skill");
const projectRoutes = require("./features/resume/project");
const achievementRoutes = require("./features/resume/achievement");
const certificationRoutes = require("./features/resume/certification");
const educationRoutes = require("./features/resume/education");
const experienceRoutes = require("./features/resume/experience");
const jobDescriptionRoutes = require("./features/job-description/jobDescription.routes");
const syncRoutes = require("./features/ml/sync.routes");
const publicRoutes = require("./features/public/public.routes");
const interviewRoutes = require("./routes/interviewRoutes");

router.use("/auth", authRoutes);

router.use("/public", publicRoutes);

// Registered here (not nested under router.use("/resume", …)) so Express 5 matches GET /resume/all after auth.
router.get("/resume/all", authenticateToken, getFullResume);
router.use("/resume/heading", headingRoutes);
router.use("/resume/skills", skillRoutes);
router.use("/resume/projects", projectRoutes);
router.use("/resume/achievements", achievementRoutes);
router.use("/resume/certifications", certificationRoutes);
router.use("/resume/education", educationRoutes);
router.use("/resume/experiences", experienceRoutes);

router.use("/job-descriptions", jobDescriptionRoutes);

router.use("/sync", syncRoutes);

router.use("/interview", interviewRoutes);

module.exports = router;
