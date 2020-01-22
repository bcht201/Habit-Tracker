var mongoose = require('mongoose');

var activitySchema = mongoose.Schema({
    name: {type: String}
});

module.exports = mongoose.model('Activity', activitySchema);