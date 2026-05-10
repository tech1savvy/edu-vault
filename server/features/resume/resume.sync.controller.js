const { Skill, Project, Certification, Experience, Education, Achievement } = require('../../models');

const syncProfileData = async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      skills = [],
      projects = [],
      certifications = [],
      experiences = [],
      education = [],
      achievements = []
    } = req.body;

    // 1. Destroy existing records for this user
    await Skill.destroy({ where: { userId } });
    await Project.destroy({ where: { userId } });
    await Certification.destroy({ where: { userId } });
    await Experience.destroy({ where: { userId } });
    await Education.destroy({ where: { userId } });
    await Achievement.destroy({ where: { userId } });

    // 2. Map data to include userId
    const skillsData = skills.map(s => {
      if (typeof s === 'string') {
        return { name: s, userId };
      }
      return { ...s, name: s.name || s.skill, userId };
    });
    const projectsData = projects.map(p => ({ ...p, userId }));
    const certificationsData = certifications.map(c => ({ ...c, userId }));
    const experiencesData = experiences.map(e => ({ ...e, userId }));
    const educationData = education.map(e => ({ ...e, userId }));
    const achievementsData = achievements.map(a => ({ ...a, userId }));

    // 3. Bulk create new records
    if (skillsData.length > 0) await Skill.bulkCreate(skillsData);
    if (projectsData.length > 0) await Project.bulkCreate(projectsData);
    if (certificationsData.length > 0) await Certification.bulkCreate(certificationsData);
    if (experiencesData.length > 0) await Experience.bulkCreate(experiencesData);
    if (educationData.length > 0) await Education.bulkCreate(educationData);
    if (achievementsData.length > 0) await Achievement.bulkCreate(achievementsData);

    res.status(200).json({ success: true, message: "Profile successfully synced to database." });
  } catch (error) {
    console.error("Error syncing profile data:", error);
    res.status(500).json({ success: false, error: "Failed to sync profile data." });
  }
};

module.exports = {
  syncProfileData
};
