const achievementModel = require('./achievement.model');

const getAchievements = async ({ user_id }) => {
  return achievementModel.getAchievements({ user_id });
};

const addAchievement = async ({ user_id, title, description, date }) => {
  return achievementModel.addAchievement({ user_id, title, description, date });
};

const updateAchievement = async (id, { title, description, date }) => {
  return achievementModel.updateAchievement(id, { title, description, date });
};

const deleteAchievement = async (id) => {
  return achievementModel.deleteAchievement(id);
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};