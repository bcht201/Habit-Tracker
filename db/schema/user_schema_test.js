var mongoose = require('mongoose');

var userSchemaTest = mongoose.Schema({
    name: String,
    // activities: [{
    //     activityID: {type: mongoose.Schema.Types.ObjectId, ref: 'ActivityTest'}
    // }]
    activities: [{type: mongoose.Schema.Types.ObjectId, ref: 'ActivityTest'}]
});

module.exports = mongoose.model('UserTest', userSchemaTest);