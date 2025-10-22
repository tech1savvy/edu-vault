const express = require('express');
const router = express.Router();
const {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} = require('./achievement.handlers');

router.get('/', getAchievements);
router.post('/', addAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;
