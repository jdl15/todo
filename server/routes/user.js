const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcryptjs'); // hash password
const jwt = require('jsonwebtoken'); // create and verify JSON web tokens, commonly used for user authentication
const authenticateToken = require('../middleware/verifyToken'); // middleware to verify JWT

require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET; // secret key for JWT

router.post('/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username});
        if (existingUser) {
            return res.status(400).json('User already exists');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json('User created successfully');
    } catch (error) {
        res.status(400).json('Error creating user');
    }
});

router.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try{
        // check if user exists
        const user = await User.findOne({ username });
        if(!user){
            return res.status(400).json('user not found');
        }
        // check if password is correct
        const validPassword = await bcrypt.compare(password, user.password);
        if(!validPassword){
            return res.status(400).json('invalid password');
        }
        // create and assign a token
        const token = jwt.sign({ _id: user._id }, jwtSecret, { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error){
        res.status(400).json('Error logging in');
    }
})

router.get('/profile', authenticateToken, async (req, res) => {
    try{
        const user = await User.findById(req.user._id);
        if(!user){
            return res.status(400).json('User not found');
        }
        res.status(200).json({ username: user.username });
    } catch(error) {
        res.status(500).json('Error getting user profile');
    }
})

module.exports = router;