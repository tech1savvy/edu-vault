const project = require('./project.service');

const getProjects = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await project.getProjects({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching projects.' });
  }
};

const addProject = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await project.addProject({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await project.updateProject(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    await project.deleteProject(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getProjects,
  addProject,
  updateProject,
  deleteProject,
};