var express = require('express'),
    connect = require('connect');
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
// mongoose.connect(process.env.MONGODB_URI,opts);

switch (app.get('env')) {
    case 'development':
        // mongoose.connect(credentials.mongo.development.connectionString, opts);
        console.log("development db connect");

        mongoose.connect(process.env.MONGODB_URI, opts);
        break;
    case 'production':
        console.log("production db connect");
        mongoose.connect(process.env.MONGODB_URI, opts);
        break;
    default:
        throw new Error('Unknown execution environment : ' + app.get('env'));
}

// 환경변수의 포트가 있다면 쓰고, 없다면 디폴트값
app.set('port', process.env.PORT || 3000);

app.use(function (req, res, next) {
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
});

// 클러스터 사용
app.use(function (req, res, next) {
    var cluster = require('cluster');
    if (cluster.isWorker) console.log('Worker %d received request', cluster.worker.id);
    next();
});

// 라우터 연결 
require('./router/routes.js')(app);



//404 핸들러
app.use((req, res) => {
    res.type('text/html');
    res.status(404);
    res.send('404-NOT FOUND')
});
// 505 핸들러
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500);
    res.send('505-error')

})


// 서버시작 메소드
function startServer() {
    app.listen(app.get('port'), () => {
        console.log("express started in " + app.get('env') +
            "mode on http:loaclhost://" +
            app.get('port') + ';press Ctrl+C to terminate');
    })

}

// 메인인지 아닌지 확인. 
if (require.main === module) {
    //어플리케이션은 앱 서버를 시동해 직접 실행됩니다
    startServer();
} else {
    //require을 통해 어플리케이션을 모듈처럼 가져옵니다.
    //함수를 반환해서 서버를 생성합니다.
    module.exports = startServer();
}
