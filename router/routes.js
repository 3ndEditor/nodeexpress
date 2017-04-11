var userdata = require('../handler/userdata');

module.exports = function (app) {
    app.get('/userInfo/:userId', userdata.getUserInfo);
    app.post('/userInfo/', userdata.postUserInfo);
    // app.use('/', (req, res) => {
    //     res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    //     // res.set('Access-Control-Allow-Headers','Origin' );
    //     // res.set('Access-Control-Allow-Headers','Content-Type' );
    //     res.send();
    // })
}