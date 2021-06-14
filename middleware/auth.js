const jwt = require('jsonwebtoken');

const authenticateToken = (req,res,next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(token === null){
        return res.status(401).json({message: 'Not Allowed'});
    }
    jwt.verify(token,process.env.ACCESS_TOKEN_SECRET, (err,user) => {
        if(err){
            return res.status(401).json({message: 'Not Allowed'});
        }
        req.user = user;
        next()
    })
}

const generateAccessToken = (user) => {
    return jwt.sign({user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h'});
}

module.exports = {
    authenticateToken,
    generateAccessToken
}