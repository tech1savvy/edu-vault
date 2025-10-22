const pool = require("pool");
const { createUserTable } = require("../../features/user/user.model");
const {
  createProjectTable,
} = require("../../features/resume/project/project.schema");
const {
  createAchievementTable,
} = require("../../features/resume/achievement/achievement.schema");
const {
  createCertificationTable,
} = require("../../features/resume/certification/certification.schema");
const {
  createEducationTable,
} = require("../../features/resume/education/education.schema");
const {
  createExperienceTable,
} = require("../../features/resume/experience/experience.schema");
const {
  createHeadingTable,
} = require("../../features/resume/heading/heading.schema");
const { createSkillTable } = require("../../features/resume/skill/skill.schema");

const setupDatabase = async () => {
  try {
    await pool.query(createUserTable);
    await pool.query(createProjectTable);
    await pool.query(createAchievementTable);
    await pool.query(createCertificationTable);
    await pool.query(createEducationTable);
    await pool.query(createExperienceTable);
    await pool.query(createHeadingTable);
    await pool.query(createSkillTable);
    console.log("Database tables created successfully");
  } catch (error) {
    console.error("Error creating database tables:", error);
  } finally {
    pool.end();
  }
};

setupDatabase();
