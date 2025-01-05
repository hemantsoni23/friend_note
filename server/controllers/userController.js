const User = require('../models/User');
const UserFriend = require('../models/UserFriend');
const Auth = require('../models/Auth');
const FriendRequest = require('../models/FriendRequest');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const userFriend = await UserFriend.findOne({ userId: user._id }).populate('friends');

        const sentFriendRequests = await FriendRequest.find({ senderId: user._id }).populate('receiverId');
        const receivedFriendRequests = await FriendRequest.find({ receiverId: user._id }).populate('senderId');

        const response = {
            ...user.toObject(),
            friends: userFriend?.friends || [],
            sentFriendRequests,
            receivedFriendRequests,
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const getOtherUserProfile = async (req, res) => {
    try {
        const {userId} = req.params;
        const user = await User.findOne({ _id: userId }).select('name bio interests avatarIndex');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
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
        const { q: query } = req.query;
        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { username: { $regex: query, $options: 'i' } },
            ],
        });
        const filteredUsers = users.filter(user => user.email !== req.user.email);
        res.json(filteredUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const sendFriendRequest = async (req, res) => {
    try {
        const { receiverId } = req.body;
        const senderUser = req.user.email; 

        const senderId = await User.findOne({ email: senderUser }).select('_id');

        const friendRequest = new FriendRequest({ senderId, receiverId });
        await friendRequest.save();

        res.status(200).json({ message: 'Friend request sent successfully.', friendRequest });
    }
    catch (error) {
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

const updateUsername = async (req, res) => {
    try {
        // TODO: Implement the update username logic
    }catch(error){
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }  
}

module.exports = {
    getUserProfile,
    getOtherUserProfile,
    updateUserProfile,
    searchUsers,
    getRecommendations,
    sendFriendRequest,
    updateUsername,
};