const mongoose = require('mongoose')

const taskdata = mongoose.Schema({
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'list',
        required: true,
    },

    task: {
    type: String,
  }
}, { timestamps: true, versionKey: false })

module.exports = mongoose.model('task', taskdata)