var Books = require('../models/books.js');

exports.userInfo = (req, res) => {
    res.type('application/json');
    res.set('Access-Control-Allow-Origin', 'http://localhost:4200');
    // res.cookie('monster', 'nom nom');
    // res.cookie('signed_monster', 'nom nom', { signed: true });
    // req.session.userName = "Anonymous";
    res.json({ hi: req.params.userId });
};

exports.books = function (req, res) {
    Books.find(function (err, books) {
        if (err) return res.status(500).send({ error: 'database failure' });
        res.json(books);
    });
}