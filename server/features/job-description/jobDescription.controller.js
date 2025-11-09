const jobDescriptionService = require('./jobDescription.service');

const getJobDescriptions = async (req, res) => {
  try {
    const result = await jobDescriptionService.getJobDescriptions();
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching job descriptions.' });
  }
};

const getJobDescriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await jobDescriptionService.getJobDescriptionById(id);
    res.json(result);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
};

const addJobDescription = async (req, res) => {
  try {
    const result = await jobDescriptionService.addJobDescription(req.body);
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateJobDescription = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await jobDescriptionService.updateJobDescription(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteJobDescription = async (req, res) => {
  try {
    const { id } = req.params;
    await jobDescriptionService.deleteJobDescription(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getJobDescriptions,
  addJobDescription,
  updateJobDescription,
  deleteJobDescription,
  getJobDescriptionById,
};