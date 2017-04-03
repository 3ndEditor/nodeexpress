var express = require('express'),
    connect = require('connect'),
    // credentials = require('./credentials.js'),
    First = require('./models/models.js')
    

// 익스프레스 사용
var app = express();




// database configuration
var mongoose = require('mongoose');
var opts = {
    server: {
        socketOptions: {
            keepAlive: 1
        }
    }
};



switch (app.get('env')) {
    case 'development':
        // mongoose.connect(credentials.mongo.development.connectionString, opts);
        mongoose.connect(process.env.MONGODB_URI, opts);
        console.log("디비연결확인");
        break;
    case 'production':
        // mongoose.connect(credentials.mongo.production.connectionString, opts);
        mongoose.connect(process.env.MONGODB_URI, opts);
        break;
    default:
        throw new Error('Unknown execution environment : ' + app.get('env'));
}

First.find(function (err, data) {
    if (err) return console.error(err);
    console.log("머가 어떻게");
    if (data.length) return;

    new First({
        name: "hello",
        category: "world!"
    }).save();

    new First({
        name: "hi",
        category: "me"
    }).save();
})

//세션 디비 연결인데 잘 모르겟음 
// var MongoSessionStore = require('session-mongoose')(require('connect'));
// var sessionStore = new MongoSessionStore({ url: credentials.mongo[app.get('env')].connectionString });

//핸들바 사용 하지만 레스트 서버라서 필요는 없음
// var handlebars = require('express-handlebars')
//     .create({ defaultLayout: 'main' });

app
    .set('port', process.env.PORT || 3000);

// app.use((req, res, next) => {
//     res.locals.showTests = app.get('env') !== 'production' &&
//         req.query.test === '1';
//     next();
// })

app
    .use('/api', require('cors')())
    //도메인 공부는 중요할듯 
    .use(function (req, res, next) {
        //이 요청을 처리할 도메인 생성
        var domain = require('domain').create();
        //도메인에서 일어난 에러 처리 
        domain.on('error', function (err) {
            console.log('DOMAIN ERROR CAUGHT\n', err.stack);
            try {
                //5초후에 안전한 셧다운
                setTimeout(function () {
                    console.error('Failsafe shutdown');
                    process.exit(1);

                }, 5000);

                //클러스터 연결해제,
                var worker = require('cluster').worker;
                if (worker) worker.disconnect();

                //요청받는 것을 중지
                server.close();
                try {
                    //익스프레스 에러 라우트 시도 
                    next(err);
                } catch (err) {
                    //익스프레스의 에러라우트가 실패하면
                    //일반 노드 응답 사용
                    console.error('Express error mechanism failed \n', err.stack);
                    res.statusCode = 500;
                    res.setHeader('content-type', 'text/plain');
                    res.end('Server error');

                }
            }
            catch (err) {
                console.error('Unable to send 500 response \n ', err.stack);
            }
        });
        //도메인에 요청과 응답객체 추가
        domain.add(req);
        domain.add(res);
        // 나머지 요청체인을 도메인에서 처리 
        domain.run(next);
    })
    .use(function (req, res, next) {
        var cluster = require('cluster');
        if (cluster.isWorker) console.log('Worker %d received request', cluster.worker.id);
        next();
    })
    // .use(require('cookie-parser')(credentials.cookieSecret))
    // .use(require('express-session')({
    //     resave: false,
    //     saveUninitialized: false,
    //     secret: credentials.cookieSecret
    // }));

// 라우터 연결
require('./router/routes.js')(app);

//rest 라우터 연결

var Rest = require('connect-rest');
var restOptions = {
    context: '/rest',
    domain: require('domain').create(),
};
var rest = Rest.create(restOptions);
var RestDB = require('./models/rest.models.js');

rest.get('/foo', function (req, content, cb) {
    RestDB.find({ name: 'kim' }, function (err, Rdbs) {
        if (err) return cb({ error: 'Internal error.' });
        cb(null, Rdbs.map(function (a) {
            return {
                name: a.name,
            };
        }));
    });
});


app
    .use((req, res) => {
        res.type('text/html');
        res.status(404);
        res.send('404-NOT FOUND')
    })
    .use((err, req, res, next) => {
        console.log(err.stack);
        res.status(500);
        res.send('505-error')

    })

function startServer() {
    app.listen(app.get('port'), () => {
        console.log("express started in " + app.get('env') +
            "mode on http:loaclhost://" +
            app.get('port') + ';press Ctrl+C to terminate');
    })

}

if (require.main === module) {
    //어플리케이션은 앱 서버를 시동해 직접 실행됩니다
    startServer();
} else {
    //require을 통해 어플리케이션을 모듈처럼 가져옵니다.
    //함수를 반환해서 서버를 생성합니다.
    module.exports = startServer();
}
