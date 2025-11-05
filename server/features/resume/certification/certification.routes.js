const express = require('express');
const router = express.Router();
const {
  getCertifications,
  addCertification,
  updateCertification,
  deleteCertification,
} = require('./certification.controller');

router.get('/', getCertifications);
router.post('/', addCertification);
router.put('/:id', updateCertification);
router.delete('/:id', deleteCertification);

module.exports = router;
