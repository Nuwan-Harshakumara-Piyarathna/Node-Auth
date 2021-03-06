const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({

    userName: {
        type:String,
        require:true
    },
    email: {
        type:String,
        require:true
    },
    password: {
        type:String,
        require:true,
    },
    role: {
        type:String,
        enum: ['ADMIN','BASIC'], 
        require:true,
    }
})

module.exports = mongoose.model('User',userSchema)