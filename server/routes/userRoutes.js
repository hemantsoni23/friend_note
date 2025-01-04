const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, updateUsername, getRecommendations } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUserProfile);
router.put('/updateUsername', authMiddleware, updateUsername);
router.get('/recommendations', authMiddleware, getRecommendations);

module.exports = router;