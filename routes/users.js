const express = require('express');
const router = express.Router();
const User = require('../models/user');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt');

// get all users
router.get('/all', async(req,res) => {
    await User.find()
        .select({ "userName": 1, "_id": 0, "email": 1,"role": 1})
        .exec().
        then(docs => {
            console.log(docs);
            res.status(200).json(docs);
        }).catch(err => {
            console.log(err);
            res.status(500).json({error: err});
        });
});

// add a new user
router.post('/add',async(req,res) => {
    try{
        const currentUser = await User.findOne({$or:[
            {
                userName: req.body.userName
            },
            {
                email: req.body.email
            }
        ]});
        if(currentUser === null){
            //hashing
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(req.body.password, salt);
            console.log(salt);
            console.log(hashedPassword);
            //create user with password hashed
            const user = new User({
                _id: new mongoose.Types.ObjectId(),
                userName: req.body.userName,
                email: req.body.email,
                password: hashedPassword,
                role: req.body.role
            });
            
            await user.save().then( result => {
                console.log(result);
                res.status(200).json(user);
            }).catch(err => {
                console.log(err);
                res.status(500).json({error: err,message: 'Case 2'});
            });
        }
        else if(currentUser.userName === req.body.userName){
            res.status(302).json('Username Already used');
        }
        else if(currentUser.email === req.body.email) {
            res.status(302).json('Email Already used');
        }
        else{
            //not need this????
            res.status(500).json({message: 'Case Nothing'});
        }
    }
    catch(e){
        res.status(500).json({error: e});
    }
});

module.exports = router;