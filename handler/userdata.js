
var UserDataSchema = require('../models/userdata.js');
exports.userInfo = (req, res) => {
    res.type('application/json');
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.cookie('monster', 'nom nom');
    // res.cookie('signed_monster', 'nom nom', { signed: true });
    // req.session.userName = "Anonymous";
    // First.find(function (err, data) {
    //     if (err) return console.error(err);
    //     console.log("머가 어떻게");
    //     if (data.length) return;

    //     new First({
    //         name: "hello",
    //         category: "world!"
    //     }).save();

    //     new First({
    //         name: "hi",
    //         category: "me"
    //     }).save();
    // })

    UserDataSchema.findOne({ userId: req.params.userId }).exec((err, userData) => {
        if (err) {
            return console.error(err);
        }
        if (userData.length) {
            return userData;
        } else {
            return -1;
        }

    })


    res.json();
};
