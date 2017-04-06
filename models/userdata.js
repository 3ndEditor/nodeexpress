var mongoose = require('mongoose');
//생성자인가 보다. 
var UserDataSchema = mongoose.Schema;

var userDataSchema = new UserDataSchema({
    userId: {
        type: String,
        trim: true, //공백삭제
        unique: true, //primay key
        required:true // 이게 없으면 데이터가 들어가지 않는다! 
    },
    userInfo: Object,
    links: Array,
    keymaps: Array
});

module.exports = mongoose.model('Userdata', userDataSchema);