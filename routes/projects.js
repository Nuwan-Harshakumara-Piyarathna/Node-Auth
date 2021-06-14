const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const mongoose = require('mongoose')
const {authenticateToken} = require('../middleware/auth');
const {setProject,authGetProject,authDeleteProject} = require('../middleware/project');
const {authUser ,authRole} = require('../middleware/basicAuth');
const {scopedProjects} = require('../permissions/project');

// get all projects
router.get('/all',authenticateToken, async (req,res) => {
    const projects = await scopedProjects(req.body.user);
    res.json({ projects });
});

router.get('/find/:id', setProject, authUser, authGetProject , (req,res) => {
    res.status(200).json({project:req.project});    
})  

router.delete('/delete/:id', setProject, authUser, authDeleteProject , (req,res) => {
    //write delete function here

    res.send('Deleted Prject');
})

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