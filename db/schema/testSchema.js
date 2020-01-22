var mongoose = require('mongoose');

var testSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    row: Number, 
    title: String
});

module.exports = mongoose.model('TestTable', testSchema);