var mongoose = require('mongoose');
var firstSchema = mongoose.Schema({
    name : String,
    cateogory : String,
})

firstSchema.methods.getData = function(){
    return name;
}   

var First = mongoose.model('First',firstSchema);
module.exports = First;

