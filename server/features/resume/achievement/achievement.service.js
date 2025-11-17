const achievementRepository = require('./achievement.repository');
const { SyncService } = require('../../ml/sync.service');

const getAchievements = async ({ user_id }) => {
  return achievementRepository.getAchievements({ user_id });
};

const addAchievement = async ({ user_id, title, description, date }) => {
  const achievement = await achievementRepository.addAchievement({ user_id, title, description, date });
  SyncService.syncResume(user_id);
  return achievement;
};

const updateAchievement = async (id, { title, description, date }) => {
  const achievement = await achievementRepository.updateAchievement(id, { title, description, date });
  if (achievement) {
    SyncService.syncResume(achievement.userId);
  }
  return achievement;
};

const deleteAchievement = async (id) => {
  const achievement = await achievementRepository.getAchievementById(id);
  if (achievement) {
    await achievementRepository.deleteAchievement(id);
    SyncService.syncResume(achievement.userId);
  }
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};