var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    title: {type: String}
});

module.exports = mongoose.model('Activity', activitySchema);