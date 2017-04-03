var mongoose = require('mongoose');
var restSchema = mongoose.Schema({
    name : String,
    updateId : String
});

var Rest = mongoose.model('Rest',restSchema);
module.exports = Rest;