const User = require('../models/User');
const UserFriend = require('../models/UserFriend');
const FriendRequest = require('../models/FriendRequest');

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.user.email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const userFriend = await UserFriend.findOne({ userId: user._id }).populate('friends');

        const sentFriendRequests = await FriendRequest.find({
            senderId: user._id,
            status: { $in: ['pending', 'rejected'] },
        }).populate({
            path: 'receiverId',
            select: 'name username avatarIndex',
        });

        const receivedFriendRequests = await FriendRequest.find({
            receiverId: user._id,
            status: { $in: ['pending', 'rejected'] },
        }).populate({
            path: 'senderId',
            select: 'name username avatarIndex', 
        });

        const response = {
            ...user.toObject(),
            friends: userFriend?.friends || [],
            sentFriendRequests: sentFriendRequests.map(req => ({
                ...req.toObject(),
            })),
            receivedFriendRequests: receivedFriendRequests.map(req => ({
                ...req.toObject(),
            })),
        };

        res.json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

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
        console.log("Fetching user details...");
        const userEmail = req.user.email;

        const user = await User.findOne({ email: userEmail }).select('_id interests');
        if (!user) {
            console.log("User not found");
            return res.status(404).json({ message: 'User not found' });
        }

        console.log("Fetching user friend document...");
        const userFriendDoc = await UserFriend.findOne({ _id: user._id });
        if (!userFriendDoc) {
            console.log("No friends found for user");
            return res.status(404).json({ message: 'No friends found for the user' });
        }

        const userFriends = userFriendDoc.friends.map(f => f.toString());

        console.log("Fetching potential friends...");
        const potentialFriends = await User.find({ _id: { $in: userFriends } })
            .populate('friends')
            .exec();

        console.log("Processing recommendations...");
        const recommendations = potentialFriends
            .filter(friend => !userFriends.includes(friend._id.toString()))
            .map(friend => ({
                userId: friend._id,
                username: friend.username,
                avatarIndex: friend.avatarIndex,
                mutualFriends: friend.friends
                    .filter(f => userFriends.includes(f._id.toString())).length,
                interestMatch: calculateInterestMatch(user.interests, friend.interests),
            }))
            .sort((a, b) =>
                b.mutualFriends * 0.7 + b.interestMatch * 0.3 -
                (a.mutualFriends * 0.7 + a.interestMatch * 0.3)
            );

        console.log("Sending recommendations...");
        res.json(recommendations);
    } catch (error) {
        console.error('Error in getRecommendations:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const acceptFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await FriendRequest.findById(requestId);
        if (!request || request.status !== 'pending') {
            return res.status(400).json({ message: 'Invalid request.' });
        }
        
        request.status = 'accepted';
        await request.save();

        console.log(request);

        // Add friends to both users' friend lists
        await UserFriend.findOneAndUpdate(
            { userId: request.senderId },
            { $push: { friends: request.receiverId } },
            { upsert: true } 
        );
        await UserFriend.findOneAndUpdate(
            { userId: request.receiverId },
            { $push: { friends: request.senderId } },
            { upsert: true } 
        );

        res.json({ message: 'Friend request accepted.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const rejectFriendRequest = async (req, res) => {
    try {
        const { requestId } = req.body;
        const request = await FriendRequest.findById(requestId);
        if (!request || request.status !== 'pending') {
            return res.status(400).json({ message: 'Invalid request.' });
        }
        
        request.status = 'rejected';
        await request.save();

        res.json({ message: 'Friend request rejected.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const removeFriend = async (req, res) => {
    try {
        const { friendId } = req.body;
        const userEmail = req.user.email;

        const user = await User.findOne({ email: userEmail }).select('_id');

        // User is removing friend
        await UserFriend.findOneAndUpdate(
            { userId:user._id },
            { $pull: { friends: friendId } }
        );

        // Friend is removing user
        await UserFriend.findOneAndUpdate(
            { userId: friendId },
            { $pull: { friends: user._id } }
        );

        res.json({ message: 'Friend removed successfully.' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const updateUsername = async (req, res) => {
    try {
        const { email } = req.user;
        const { username } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists. Please use something else.' });
        }

        user.username = username;
        await user.save();

        res.json({message:"Username updated successfully",user:user});
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
    acceptFriendRequest,
    rejectFriendRequest,
    removeFriend
};