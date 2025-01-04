const Auth = require('../models/Auth')
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const createAccessToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '2h' });
};

const registerUser = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = await Auth.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newAuthUser = new Auth({
            email,
            username,
            password: hashedPassword,
        });
        const savedAuthUser = await newAuthUser.save();
        // Create a corresponding entry in the Users collection
        const newUser = new User({
            authId: savedAuthUser._id, 
            name: username, 
            bio: '', 
            interests: [], 
            avatarIndex: 0, 
        });
        await newUser.save();
        const accessToken = createAccessToken({ email, username });
        res.json({ accessToken, newUser });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'User does not exist' });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid password' });
        }
        const accessToken = createAccessToken({ email, username: user.username });
        res.json({ accessToken });
    }
    catch (error) {
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
    registerUser,
    loginUser,
    updateUsername,
};