var userdata = require('../handler/userdata');

module.exports = function (app) {
    app.get('/userInfo/:userId', userdata.userInfo);
}