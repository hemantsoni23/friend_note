const User = require('../models/User');
const UserFriend = require('../models/UserFriend');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });
        const userFriend = await UserFriend.findOne({ userId: user._id }).populate('friends');
        user.friends = userFriend.friends;
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const { name, bio, interests } = req.body;
        const user = await User.findOneAndUpdate({ email }, { name, bio, interests }, { new: true });
        res.json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const searchUsers = async (req, res) => {
    try {
        const { q:query } = req.query;
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { email: { $regex: query, $options: 'i' } },
            ],
        });
        res.json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getRecommendations = async (req, res) => {
    try {
        // TODO: Implement the recommendation logic
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    getUserProfile,
    updateUserProfile,
    searchUsers,
    getRecommendations,
};