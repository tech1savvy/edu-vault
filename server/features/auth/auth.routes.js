const express = require('express');
const router = express.Router();
const { handleSignup, handleLogin } = require('./auth.controller');
const validate = require('../../middleware/validation');
const { signupSchema, loginSchema } = require('./auth.validation');

router.post('/signup', validate(signupSchema), handleSignup);
router.post('/login', validate(loginSchema), handleLogin);

module.exports = router;
