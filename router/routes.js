var main = require('../handler/userdata');

module.exports = function(app){
    app.get('/userInfo/:userId',main.userInfo);
    app.get('/books',main.books);
}