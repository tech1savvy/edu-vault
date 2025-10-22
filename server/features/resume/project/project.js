const projectModel = require('./project.model');

const getProjects = async ({ user_id }) => {
  return projectModel.getProjects({ user_id });
};

const addProject = async ({ user_id, title, description, techStack, timeline, type, collaborators }) => {
  return projectModel.addProject({ user_id, title, description, techStack, timeline, type, collaborators });
};

const updateProject = async (id, { title, description, techStack, timeline, type, collaborators }) => {
  return projectModel.updateProject(id, { title, description, techStack, timeline, type, collaborators });
};

const deleteProject = async (id) => {
  return projectModel.deleteProject(id);
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};