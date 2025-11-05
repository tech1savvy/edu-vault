const certification = require('./certification.service');

const getCertifications = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await certification.getCertifications({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching certifications.' });
  }
};

const addCertification = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const result = await certification.addCertification({ ...req.body, user_id });
    res.status(201).json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const updateCertification = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await certification.updateCertification(id, req.body);
    res.json(result);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

const deleteCertification = async (req, res) => {
  try {
    const { id } = req.params;
    await certification.deleteCertification(id);
    res.status(204).send();
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
};

module.exports = {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
};