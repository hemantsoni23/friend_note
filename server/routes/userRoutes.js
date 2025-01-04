const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getRecommendations, searchUsers } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.put('/update', authMiddleware, updateUserProfile);
router.get('/search', authMiddleware, searchUsers);
router.get('/recommendations', authMiddleware, getRecommendations);

module.exports = router;