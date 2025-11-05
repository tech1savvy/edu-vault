const express = require('express');
const router = express.Router();
const {
  getExperiences,
  addExperience,
  updateExperience,
  deleteExperience,
} = require('./experience.controller');

router.get('/', getExperiences);
router.post('/', addExperience);
router.put('/:id', updateExperience);
router.delete('/:id', deleteExperience);

module.exports = router;
