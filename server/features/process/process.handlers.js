const processResume = require('./process');

const handleProcessResume = async (req, res) => {
  try {
    // TODO: get user_id from session
    const user_id = req.user.id;
    const resumeData = req.body;

    // Core logic will go here
    await processResume.embedAndStore(user_id, resumeData);

    res.status(200).json({ message: 'Resume processed successfully.' });
  } catch (error) {
    res.status(500).json({ error: `Failed to process resume: ${error.message}` });
  }
};

module.exports = {
  handleProcessResume,
};
