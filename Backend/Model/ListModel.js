const mongoose = require('mongoose')

const listmodel = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : 'datahere'
    },

    list:{
        type: String
    }
}, {timestamps : true, versionKey : false})

module.exports = mongoose.model('list', listmodel)