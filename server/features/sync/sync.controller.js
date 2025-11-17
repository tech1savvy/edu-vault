const { SyncService } = require('../ml');

const syncAll = async (req, res) => {
  // Do not await. Let this run in the background.
  SyncService.syncAll();

  res.status(202).json({ message: 'Synchronization process started.' });
};

module.exports = {
  syncAll,
};
