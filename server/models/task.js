const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    taskDescription: {
        type: String,
        required: true
    },
    completion:{
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Task', TaskSchema);