const express = require('express');
const router = express.Router();
const {
  getHeading,
  createOrUpdateHeading,
} = require('./heading.handlers');

router.get('/', getHeading);
router.post('/', createOrUpdateHeading);

module.exports = router;
