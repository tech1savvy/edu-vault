const { Skill, Project, Certification, Experience, Education, Achievement, sequelize } = require('../../models');

const syncProfileData = async (req, res) => {
  const transaction = await sequelize.transaction();
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
    await Skill.destroy({ where: { userId }, transaction });
    await Project.destroy({ where: { userId }, transaction });
    await Certification.destroy({ where: { userId }, transaction });
    await Experience.destroy({ where: { userId }, transaction });
    await Education.destroy({ where: { userId }, transaction });
    await Achievement.destroy({ where: { userId }, transaction });

    // 2. Map data to include userId and handle field mismatches
    const skillsData = (skills || []).map(s => {
      if (typeof s === 'string') return { name: s, userId };
      return { 
        name: s.name || s.skill || "", 
        level: s.level || "Intermediate",
        userId 
      };
    });

    const projectsData = (projects || []).map(p => ({ 
      title: p.title || "",
      description: p.description || "",
      techStack: p.techStack || "",
      timeline: p.timeline || "",
      type: p.type || "Individual",
      collaborators: p.collaborators || "",
      userId 
    }));

    const certificationsData = (certifications || []).map(c => ({ 
      name: c.name || "",
      issuer: c.issuer || "",
      date: c.date || "",
      credentialId: c.credentialId || "",
      userId 
    }));

    const experiencesData = (experiences || []).map(e => ({ 
      type: e.type || "Job",
      company: e.company || "",
      role: e.role || "",
      duration: e.duration || "",
      details: e.details || "",
      userId 
    }));

    const educationData = (education || []).map(e => ({ 
      institution: e.institution || e.college || "",
      degree: e.degree || "",
      fieldOfStudy: e.fieldOfStudy || e.location || "",
      duration: e.duration || `${e.startDate || ""} ${e.endDate ? `- ${e.endDate}` : ""}`.trim(),
      details: e.details || "",
      cgpa: parseFloat(e.score || e.cgpa) || null,
      userId 
    }));

    const achievementsData = (achievements || []).map(a => ({ 
      title: a.title || "",
      description: a.description || "",
      date: a.date || "",
      userId 
    }));

    // 3. Bulk create new records
    if (skillsData.length > 0) await Skill.bulkCreate(skillsData, { transaction });
    if (projectsData.length > 0) await Project.bulkCreate(projectsData, { transaction });
    if (certificationsData.length > 0) await Certification.bulkCreate(certificationsData, { transaction });
    if (experiencesData.length > 0) await Experience.bulkCreate(experiencesData, { transaction });
    if (educationData.length > 0) await Education.bulkCreate(educationData, { transaction });
    if (achievementsData.length > 0) await Achievement.bulkCreate(achievementsData, { transaction });

    await transaction.commit();
    res.status(200).json({ success: true, message: "Profile successfully synced to database." });
  } catch (error) {
    if (transaction) await transaction.rollback();
    console.error("Error syncing profile data:", error);
    res.status(500).json({ success: false, error: "Failed to sync profile data." });
  }
};

module.exports = {
  syncProfileData
};
