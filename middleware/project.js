const Project = require('../models/project');
const {canViewProject,canDeleteProject} = require('../permissions/project');

const setProject = async (req,res,next) => {
    const id = req.params.id;

    await Project.findById(id)
        .exec()
        .then(doc => {
            if(doc){
                req.project = doc;
                next()
            }
            else{
                res.status(404).json({message: 'No valid Entry found for provided ID'});  
            }
        })
        .catch(err => {
            res.status(500).json({error: err});
        });
}

function authGetProject(req, res, next){
    if(!canViewProject(req.body.user, req.body.project)){
        res.status(401)
        return res.send('Not Allowed');
    }
    next();
}

function authDeleteProject(req, res, next){
    if(!canDeleteProject(req.body.user, req.body.project)){
        res.status(401)
        return res.send('Not Allowed');
    }
    next();
}

module.exports = {
    setProject,
    authGetProject,
    authDeleteProject
}