var fs = require('fs');
var http = require('http');
const cluster = require('cluster');
const numCPUs = require("os").cpus().length;
var https = require('https');
var privateKey = fs.readFileSync('./sslcert/server.key', 'utf8');
var certificate = fs.readFileSync('./sslcert/server.crt', 'utf8');
var indexRouter = require('./routes/index');
var oneKRouter = require('./routes/1k');
var credentials = { key: privateKey, cert: certificate };
const port = [8080, 8443] // http, https port
var express = require('express');
var app = express();
// your express configuration here

if (cluster.isMaster) { // 마스터 프로세스 식별
  console.log(`마스터 프로세스 아이디: ${process.pid}`);
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork(); // 코어 갯수만큼 워커 프로세스 생성
  }
  cluster.on("exit", (worker, code, signal) => {
    console.log(`${worker.process.pid}가 종료됐습니다.`);
    cluster.fork();
  });
} else {

app.set('views', __dirname + '/views');

app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
var time = 3*60*1000

var httpServer = http.createServer(app).on('connection', function(socket) {
  socket.setTimeout(time);
});
var httpsServer = https.createServer(credentials, app).on('connection', function(socket) {
  socket.setTimeout(time);
});

app.get('/', function (req, res, next) {
    res.render('index.html');
});

app.use('/web', indexRouter);
app.use('/json', oneKRouter);


httpserver = httpServer.listen(port[0], function () {
    console.log("http listen on", port[0])
});
httpsserver = httpsServer.listen(port[1], function () {
    console.log("https listen on", port[1])
});

httpserver.keepAliveTimeout = time;
httpserver.headersTimeout = time;

httpsserver.keepAliveTimeout = time;
httpsserver.headersTimeout = time;
}
