const express = require('express');
const router = express.Router();
const {
  getAchievements,
  addAchievement,
  updateAchievement,
  deleteAchievement,
} = require('./achievement.controller');

router.get('/', getAchievements);
router.post('/', addAchievement);
router.put('/:id', updateAchievement);
router.delete('/:id', deleteAchievement);

module.exports = router;
