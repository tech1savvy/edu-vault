const express = require('express');
const router = express.Router();
const {
  getEducations,
  addEducation,
  updateEducation,
  deleteEducation,
} = require('./education.handlers');

router.get('/', getEducations);
router.post('/', addEducation);
router.put('/:id', updateEducation);
router.delete('/:id', deleteEducation);

module.exports = router;
