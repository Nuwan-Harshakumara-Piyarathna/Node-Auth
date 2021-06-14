function authUser(req,res,next){
    console.log(req.body.user);
    if(!req.body.user || req.body.user === null ){
        res.status(403).json('Do not have access');
    }
    else{
        console.log('AuthUser function else');
        next()
    }
}

function authRole(role){
    return (req,res,next) => {
        if(req.body.user.role !== role){
            res.status(401).json({message: 'Forbidden'})
            return;
        }
        next();
    }
}

module.exports = {
    authUser,
    authRole
}