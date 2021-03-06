
var UserDataSchema = require('../models/userdata.js');
exports.getUserInfo = (req, res) => {
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
        //에러 검사
        if (err) {
            return console.error(err);
        }
        if (userData) {
            // db안에 데이터가 있다면 데이터를 보냄
            res.json(userData);
        } else {
            // db안에 데이터가 없다면 userId만 들어간 데이터를 생성함. 
            new UserDataSchema({
                userId: req.params.userId
            })
                .save()
                .then(() => {
                    res.json({ nothing: "There isn't userData, So create new userData with userId " });
                })
                .catch((err) => {
                    res.json(err)
                });
        }
    })
};

exports.postUserInfo = (req, res) => {
    res.type('application/x-www-form-urlencoded');
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');

    let query = { userId: req.userInfo.id };

    UserDataSchema.findOneAndUpdate(query, {
        userInfo: req.userInfo
    },
        {
            upsert: true

        }, (err, doc) => {
            if (err) return res.send(500, { error: err });
            return res.send("succesfully saved");
        });
};

