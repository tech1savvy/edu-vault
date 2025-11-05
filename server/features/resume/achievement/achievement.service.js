const achievementRepository = require('./achievement.repository');

const getAchievements = async ({ user_id }) => {
  return achievementRepository.getAchievements({ user_id });
};

const addAchievement = async ({ user_id, title, description, date }) => {
  return achievementRepository.addAchievement({ user_id, title, description, date });
};

const updateAchievement = async (id, { title, description, date }) => {
  return achievementRepository.updateAchievement(id, { title, description, date });
};

const deleteAchievement = async (id) => {
  return achievementRepository.deleteAchievement(id);
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};