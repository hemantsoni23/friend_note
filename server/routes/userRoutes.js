const express = require('express');
const router = express.Router();
const { getUserProfile, updateUserProfile, getRecommendations, searchUsers, getOtherUserProfile, sendFriendRequest, updateUsername } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.get('/search', authMiddleware, searchUsers);
router.put('/update', authMiddleware, updateUserProfile);
router.get('/:userId', authMiddleware, getOtherUserProfile);
router.post('/send-friend-request', authMiddleware, sendFriendRequest);
router.get('/recommendations', authMiddleware, getRecommendations);
router.put('/updateUsername', authMiddleware, updateUsername);

module.exports = router;