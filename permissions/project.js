const Project = require('../models/project');

function canViewProject(user, project){
    return (
        user.role === 'ADMIN' ||
        project.userId === user._id
    )
    next()
}

const scopedProjects = async (user) => {
    const projects = await Project.find();
    // console.log(projects);
    if(user.role === 'ADMIN'){
        console.log('Yes');
        return projects;
    }
    return projects.filter(project => project.userId === user._id);
}

function canDeleteProject(user, project){
    return (
        user.role === 'ADMIN' ||
        project.userId === user._id
    )
    next()
}

module.exports = {
    canViewProject,
    scopedProjects
}