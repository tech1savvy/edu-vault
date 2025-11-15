const achievementRepository = require('../achievement/achievement.repository');
const certificationRepository = require('../certification/certification.repository');
const educationRepository = require('../education/education.repository');
const experienceRepository = require('../experience/experience.repository');
const headingRepository = require('../heading/heading.repository');
const projectRepository = require('../project/project.repository');
const skillRepository = require('../skill/skill.repository');

const getFullResume = async ({ user_id }) => {
  const headingData = await headingRepository.getHeading({ user_id });
  const experiencesData = await experienceRepository.getExperiences({ user_id });
  const educationData = await educationRepository.getEducations({ user_id });
  const projectsData = await projectRepository.getProjects({ user_id });
  const skillsData = await skillRepository.getSkills({ user_id });
  const achievementsData = await achievementRepository.getAchievements({ user_id });
  const certificationsData = await certificationRepository.getCertifications({ user_id });

  return {
    headingData,
    experiencesData,
    educationData,
    projectsData,
    skillsData,
    achievementsData,
    certificationsData,
  };
};

module.exports = {
  getFullResume,
};
