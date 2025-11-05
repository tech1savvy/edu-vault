const skillRepository = require('./skill.repository');

const getSkills = async ({ user_id }) => {
  return skillRepository.getSkills({ user_id });
};

const addSkill = async ({ user_id, name, level }) => {
  return skillRepository.addSkill({ user_id, name, level });
};

const updateSkill = async (id, { name, level }) => {
  return skillRepository.updateSkill(id, { name, level });
};

const deleteSkill = async (id) => {
  return skillRepository.deleteSkill(id);
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};