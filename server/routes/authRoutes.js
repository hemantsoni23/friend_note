const express = require('express');
const router = express.Router();
const { registerUser, loginUser, updateUsername } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;
