var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},  
    name: String,
    frequency: {type: Number},
    deadline: {type: String},
    completedTodayNum: {type: Number},
    lastCompleted: {type: String},
    completedToday: {type: Boolean},
    streak: {type: Number}
});

module.exports = mongoose.model('Activity', activitySchema);