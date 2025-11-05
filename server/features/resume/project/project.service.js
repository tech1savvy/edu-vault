const projectRepository = require('./project.repository');

const getProjects = async ({ user_id }) => {
  return projectRepository.getProjects({ user_id });
};

const addProject = async ({ user_id, title, description, techStack, timeline, type, collaborators }) => {
  return projectRepository.addProject({ user_id, title, description, techStack, timeline, type, collaborators });
};

const updateProject = async (id, { title, description, techStack, timeline, type, collaborators }) => {
  return projectRepository.updateProject(id, { title, description, techStack, timeline, type, collaborators });
};

const deleteProject = async (id) => {
  return projectRepository.deleteProject(id);
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};