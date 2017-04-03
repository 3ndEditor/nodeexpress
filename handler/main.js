var First = require('../models/models.js');
var Books = require('../models/books.js');

exports.home = (req, res) => {
    res.type('application/json');
    // res.set('Access-Control-Allow-Credentials','false');
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.cookie('monster', 'nom nom');
    // res.cookie('signed_monster', 'nom nom', { signed: true });
    // console.log(req.cookies)
    // console.log(req.signedCookies.signed_monster);
    // req.session.userName = "Anonymous";

    res.json({ hi: "hellooodd" });
}

exports.fail = function (req, res) {
    throw new Error('Nope!');
}

exports.epic_fail = function (req, res) {
    process.nextTick(function () {
        throw new Error('Kaboom!');
    })
}

// exports.first = function (req, res) {
//     First.find({ name: 'hello' }, function (err, firsts) {
//         var context = {
//             first: firsts.map(function (first) {
//                 return {
//                     name: first.name
//                 }
//             })
//         }
//         res.send(context);
//     })
// }
exports.books = function (req, res) {
    Books.find(function (err, books) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.json(books);
    });
}