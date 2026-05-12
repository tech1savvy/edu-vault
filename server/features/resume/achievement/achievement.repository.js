const { Achievement } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getAchievements = async (params) => {
  const userId = resolveUserId(params);
  return await Achievement.findAll({ where: { userId } });
};

const addAchievement = async (params) => {
  const userId = resolveUserId(params);
  const { title, description, date } = params;
  return await Achievement.create({ userId, title, description, date });
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

const getAchievementById = async (id) => {
  return await Achievement.findByPk(id);
};

module.exports = {
  getAchievements,
  getAchievementById,
  addAchievement,
  updateAchievement,
  deleteAchievement,
};