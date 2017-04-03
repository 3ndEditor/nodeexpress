var main = require('../handler/main.js');

module.exports = function(app){
    app.get('/',main.home);
    app.get('/fail',main.fail);
    app.get('/epic-fail',main.epic_fail);
    app.get('/first',main.first);
}