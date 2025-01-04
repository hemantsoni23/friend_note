const Auth = require('../models/Auth')
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
        const newUser = new Auth({
            email,
            username,
            password: hashedPassword,
        });
        await newUser.save();
        const accessToken = createAccessToken({ email, username });
        res.json({ accessToken });
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

module.exports = {
    registerUser,
    loginUser,
};