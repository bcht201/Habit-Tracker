var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    name: {type: String},
    frequency: {type: Number},
    deadline: {type: String},
    timeFrame: {
        type: String,
        enum: ['daily', 'weekly']
    },
    completedPerTimeframe: {type: Number},
    lastCompleted: {type: String},
    completed: {type: Boolean},
    streak: {type: Number}
});

module.exports = mongoose.model('Activity', activitySchema);