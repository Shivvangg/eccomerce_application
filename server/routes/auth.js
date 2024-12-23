const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth');

const authRouter = express.Router();

authRouter.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({
                message: "User already exists"
            });
        }

        const hashedPassword = await bcryptjs.hash(password, 8); // first parameter is the password and the second is the salt. Salt => it is the random string, with salt, the password hashed is no longer predictable to us.

        let user = new User({
            name,
            email,
            password: hashedPassword,
        });
        user = await user.save();
        return res.status(201).json({ user });
    } catch (e) {
        res.status(500).json({ error: error, message: "Error creating the user" });
    }
});

//sign in route for the user 
authRouter.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "User does not exist, sign up first and then login" });
        }
        const isMatch = await bcryptjs.compare(password, user.password);
        if(!isMatch){
            res.status(400).json({message: "Please enter correct password"});
        }
        const token = jwt.sign({id: user._id}, "passwordKey"); // with this key we will verify that the user is authenticated user or not
        res.status(200).json({token, ...user._doc});
    } catch (e) {
        // res.status(500).json({ error: e, message: "Error loggin in the user" });
    }
});

//to check the token is correct or not
authRouter.post('/tokenIsValid', async (req, res) => {
    try {
        const token = req.header('x-auth-token');
        if(!token) return res.json(false);
        const isVerify = jwt.verify(token, passwordKey);
        if(!isVerify) return res.json(false);

        const user = await User.findById(isVerify.id);
        if(!user) return res.json(false);
        return res.json(true);
    } catch (e) {
        // res.status(500).json({ error: e, message: "Error loggin in the user" });
    }
});

//get the user data
authRouter.get('/', auth, async (req,res) => {
    const user = await User.findById(req.user);
    res.json({...user._doc, token: req.token});
});

module.exports = authRouter;