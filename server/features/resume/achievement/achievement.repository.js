const { Achievement } = require('../../../models');

const getAchievements = async ({ user_id }) => {
  return await Achievement.findAll({ where: { user_id } });
};

const addAchievement = async ({ user_id, title, description, date }) => {
  return await Achievement.create({ user_id, title, description, date });
};

const updateAchievement = async (id, { title, description, date }) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) {
    throw new Error('Achievement not found');
  }
  return await achievement.update({ title, description, date });
};

const deleteAchievement = async (id) => {
  const achievement = await Achievement.findByPk(id);
  if (!achievement) {
    throw new Error('Achievement not found');
  }
  return await achievement.destroy();
};

module.exports = {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};