var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
    title: {type: String}
});

module.exports = mongoose.model('testActivity', testSchema);