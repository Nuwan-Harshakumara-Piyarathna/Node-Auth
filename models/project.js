const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({

    name: {
        type:String,
        require:true
    },
    userId: {
        type:String,
        require:true
    }
});

module.exports = mongoose.model('Project',projectSchema)