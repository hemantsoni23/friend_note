const express = require('express');
const router = express.Router();
const {
    getUserProfile,
    updateUserProfile,
    getRecommendations,
    searchUsers,
    getOtherUserProfile,
    sendFriendRequest,
    updateUsername,
    acceptFriendRequest,
    rejectFriendRequest
} = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getUserProfile);
router.get('/search', authMiddleware, searchUsers);
router.put('/update', authMiddleware, updateUserProfile);
router.get('/:userId', authMiddleware, getOtherUserProfile);
router.post('/send-friend-request', authMiddleware, sendFriendRequest);
router.get('/recommendations', authMiddleware, getRecommendations);
router.put('/updateUsername', authMiddleware, updateUsername);
router.post('/accept-friend-request', authMiddleware, acceptFriendRequest);
router.post('/reject-friend-request', authMiddleware, rejectFriendRequest);

module.exports = router;