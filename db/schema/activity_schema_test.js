var mongoose = require('mongoose');

var activitySchemaTest = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'UserTest'},
    name: String,
    frequency: {type: Number},
    deadline: {type: String},
    completedNum: {type: Number},
    lastCompleted: {type: String},
    completed: {type: Boolean},
    streak: {type: Number}
});

module.exports = mongoose.model('ActivityTest', activitySchemaTest);