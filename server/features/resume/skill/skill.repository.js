const { Skill } = require('../../../models');

const getSkills = async ({ user_id }) => {
  return await Skill.findAll({ where: { user_id } });
};

const addSkill = async ({ user_id, name, level }) => {
  return await Skill.create({ user_id, name, level });
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

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};