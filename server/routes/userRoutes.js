const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getRecommendations,
    searchUsers,
    sendFriendRequest,
    updateUsername,
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.get('/search', authMiddleware, searchUsers);
router.put('/update', authMiddleware, updateUserProfile);
router.post('/send-friend-request', authMiddleware, sendFriendRequest);
router.get('/recommendations', authMiddleware, getRecommendations);
router.put('/updateUsername', authMiddleware, updateUsername);
router.post('/accept-friend-request', authMiddleware, acceptFriendRequest);
router.post('/reject-friend-request', authMiddleware, rejectFriendRequest);
router.post('/removeFriend', authMiddleware, removeFriend);

module.exports = router;