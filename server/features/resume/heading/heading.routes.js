const express = require('express');
const router = express.Router();
const {
  getHeading,
  createOrUpdateHeading,
} = require('./heading.controller');

router.get('/', getHeading);
router.post('/', createOrUpdateHeading);

module.exports = router;
