const fullResumeService = require('./full-resume.service');

const getFullResume = async (req, res) => {
  try {
    const user_id = req.user.id;
    const result = await fullResumeService.getFullResume({ user_id });
    res.json(result);
  } catch(e) {
    res.status(500).send({ error: 'Problem fetching full resume.' });
  }
};

module.exports = {
  getFullResume,
};
