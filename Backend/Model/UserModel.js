const mongoose = require('mongoose')

const newData = mongoose.Schema({
    name : {
        type : String
    },

    email : {
        type : String
    },

    password : {
        type : String
    }, 

    age : {
        type : String
    },

    gender : {
        type : String
    },
    otp : {
        type : String
    },

}, {timestamps : true, versionKey : false})

module.exports = mongoose.model('datahere', newData)