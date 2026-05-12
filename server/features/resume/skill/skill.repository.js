const { Skill } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getSkills = async (params) => {
  const userId = resolveUserId(params);
  return await Skill.findAll({ where: { userId } });
};

const addSkill = async (params) => {
  const userId = resolveUserId(params);
  const { name, level } = params;
  return await Skill.create({ userId, name, level });
};

const updateSkill = async (id, { name, level }) => {
  const skill = await Skill.findByPk(id);
  if (!skill) {
    throw new Error('Skill not found');
  }
  return await skill.update({ name, level });
};

const deleteSkill = async (id) => {
  const skill = await Skill.findByPk(id);
  if (!skill) {
    throw new Error('Skill not found');
  }
  return await skill.destroy();
};

const getSkillById = async (id) => {
  return await Skill.findByPk(id);
};

module.exports = {
  getSkills,
  getSkillById,
  addSkill,
  updateSkill,
  deleteSkill,
};