const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const mongoose = require('mongoose')
const {authenticateToken} = require('../middleware/auth');

// get all projects
router.get('/all',authenticateToken, async(req,res) => {
    await Project.find()
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
router.post('/add', authenticateToken ,async(req,res) => {
    const project = new Project({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        userId: req.body.userId
    });
    
    await project.save().then( result => {
        console.log(result);
        res.status(200).json(project);
    }).catch(err => {
        console.log(err);
        res.status(500).json({error: err});
    }); 
});

module.exports = router;