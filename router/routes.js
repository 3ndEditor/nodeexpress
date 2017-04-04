var main = require('../handler/main.js');

module.exports = function(app){
    app.get('/userInfo/:userId',main.userInfo);
    app.get('/books',main.books);
}