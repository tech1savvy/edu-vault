const { Project } = require('../../../models');

const getProjects = async ({ user_id }) => {
  return await Project.findAll({ where: { user_id } });
};

const addProject = async ({ user_id, title, description, techStack, timeline, type, collaborators }) => {
  return await Project.create({ user_id, title, description, techStack, timeline, type, collaborators });
};

const updateProject = async (id, { title, description, techStack, timeline, type, collaborators }) => {
  const project = await Project.findByPk(id);
  if (!project) {
    throw new Error('Project not found');
  }
  return await project.update({ title, description, techStack, timeline, type, collaborators });
};

const deleteProject = async (id) => {
  const project = await Project.findByPk(id);
  if (!project) {
    throw new Error('Project not found');
  }
  return await project.destroy();
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};