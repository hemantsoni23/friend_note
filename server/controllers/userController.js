const User = require('../models/User');
const UserFriend = require('../models/UserFriend');
const Auth = require('../models/Auth');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const auth = await Auth.findOne({ email: user.email }).select('username email');

        if (!auth) {
            return res.status(404).json({ message: 'Auth record not found' });
        }

        const userFriend = await UserFriend.findOne({ userId: user._id }).populate('friends');

        const response = {
            ...user.toObject(),
            username: auth.username, 
            friends: userFriend?.friends || [],
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateUserProfile = async (req, res) => {
    try {
        const { email } = req.user;
        const { name, bio, interests, avatarIndex } = req.body;
        const user = await User.findOneAndUpdate({ email }, { name, bio, interests, avatarIndex }, { new: true });
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
        const filteredUsers = users.filter(user => user.email !== req.user.email);
        res.json(filteredUsers);
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