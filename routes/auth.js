const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');
const {generateAccessToken} = require('../middleware/auth');
const {authUser ,authRole} = require('../middleware/basicAuth');
let refreshTokens = [];

router.post('/login', async (req,res) => {
    //Authenticate the user
    await User.findOne({
        userName: req.body.userName,
    })
        .exec()
        .then(async user => {
            console.log('login = ',user);
            if (user == null || typeof(user) === undefined) {
                res.status(404).json({ message: 'Cannot find User with Given User Name' });
            } 
            if(await bcrypt.compare(req.body.password,user.password)){

                //successfully authenticated
                const myUser = {
                    _id: user._id,
                    userName:user.userName,
                    email:user.email,
                    password:user.password,
                }
                const accessToken = generateAccessToken(myUser);
                const refreshToken = jwt.sign({myUser}, process.env.REFRESH_TOKEN_SECRET)
                refreshTokens.push(refreshToken);
                res.status(200).json({
                    accessToken,
                    refreshToken,
                    role: user.role
                })
            }
            else{
                res.status(405).json({ message: 'Not Allowed'});
            }           
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({ error: err });
        });
})

router.delete('/logout', (req,res) => {
    refreshTokens = refreshTokens.filter(token => token !== req.body.token);
    res.status(200).json({ message: 'Logout Successfully' });
})

//when jwt is expired ,we can send refresh token to the server and get a new jwt token
router.post('/token', (req,res) => {
    const refreshToken = req.body.token;
    if(refreshToken === null){
        return res.status(401).json({message: 'Not Allowed'});
    }
    if(!refreshTokens.includes(refreshToken)){
        return res.status(403).json({mssage: 'Forbidden'});
    }

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if(err){
            return res.sendStatus(403);
        }
        console.log(user);
        //have to remove the user objects's unnecessary attribute (iat = issued at)
        const myUser = {
            _id: user._id,
            userName:user.userName,
            email:user.email,
            password:user.password,
        }
        console.log('myUser = ',myUser);
        const accessToken = generateAccessToken(myUser);
        res.json({ accessToken })
    })
})

//testing
router.get('/',(req,res) => {
    res.send('Home Page');
})

router.get('/dashboard',authUser, (req,res) => {
    res.send('Dashboard Page');
})

router.get('/admin', authUser, authRole('ADMIN'), (req,res) => {
    res.send('Admin Page');
})

setUser = async (req,res,next) => {
    const userId = req.body.userId;
    if(userId){
        await User.findById(userId)
        .exec()
        .then(user => {
            req.user = user;
        })
        .catch(e => {
            res.status(500).json({error: e});
        })
    }
    next()
}


module.exports = router;