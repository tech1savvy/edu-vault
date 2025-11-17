const skillRepository = require('./skill.repository');
const { SyncService } = require('../../ml/sync.service');

const getSkills = async ({ user_id }) => {
  return skillRepository.getSkills({ user_id });
};

const addSkill = async ({ user_id, name, level }) => {
  const skill = await skillRepository.addSkill({ user_id, name, level });
  SyncService.syncResume(user_id);
  return skill;
};

const updateSkill = async (id, { name, level }) => {
  const skill = await skillRepository.updateSkill(id, { name, level });
  if (skill) {
    SyncService.syncResume(skill.userId);
  }
  return skill;
};

const deleteSkill = async (id) => {
  const skill = await skillRepository.getSkillById(id);
  if (skill) {
    await skillRepository.deleteSkill(id);
    SyncService.syncResume(skill.userId);
  }
};

module.exports = {
  getSkills,
  addSkill,
  updateSkill,
  deleteSkill,
};