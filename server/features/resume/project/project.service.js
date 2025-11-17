const projectRepository = require('./project.repository');
const { SyncService } = require('../../ml/sync.service');

const getProjects = async ({ user_id }) => {
  return projectRepository.getProjects({ user_id });
};

const addProject = async ({ user_id, title, description, techStack, timeline, type, collaborators }) => {
  const project = await projectRepository.addProject({ user_id, title, description, techStack, timeline, type, collaborators });
  SyncService.syncResume(user_id);
  return project;
};

const updateProject = async (id, { title, description, techStack, timeline, type, collaborators }) => {
  const project = await projectRepository.updateProject(id, { title, description, techStack, timeline, type, collaborators });
  if (project) {
    SyncService.syncResume(project.userId);
  }
  return project;
};

const deleteProject = async (id) => {
  const project = await projectRepository.getProjectById(id);
  if (project) {
    await projectRepository.deleteProject(id);
    SyncService.syncResume(project.userId);
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};