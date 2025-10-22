const skillModel = require('./skill.model');

const getSkills = async ({ user_id }) => {
  return skillModel.getSkills({ user_id });
};

const addSkill = async ({ user_id, name, level }) => {
  return skillModel.addSkill({ user_id, name, level });
};

const updateSkill = async (id, { name, level }) => {
  return skillModel.updateSkill(id, { name, level });
};

const deleteSkill = async (id) => {
  return skillModel.deleteSkill(id);
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};