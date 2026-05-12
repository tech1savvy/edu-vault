const { Project } = require('../../../models');
const { resolveUserId } = require('../resolveUserId');

const getProjects = async (params) => {
  const userId = resolveUserId(params);
  return await Project.findAll({ where: { userId } });
};

const addProject = async (params) => {
  const userId = resolveUserId(params);
  const { title, description, techStack, timeline, type, collaborators } = params;
  return await Project.create({ userId, title, description, techStack, timeline, type, collaborators });
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

const getProjectById = async (id) => {
  return await Project.findByPk(id);
};

module.exports = {
  getProjects,
  getProjectById,
  addProject,
  updateProject,
  deleteProject,
};