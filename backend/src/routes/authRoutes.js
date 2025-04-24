
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// POST /api/auth/login
router.post('/login', userController.authenticateUser);

// POST /api/auth/signup
router.post('/signup', userController.createUser);

module.exports = router;
