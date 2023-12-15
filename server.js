var express = require('express');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var session = require('express-session');
var path = require('path');
var app = express();

// 데이터베이스 연결 설정
var db = mysql.createConnection({
  host: 'localhost',
  user: 'brick',
  password: '12345',
  database: 'Brick'
});

// 데이터베이스에 연결
db.connect(function(err) {
  if (err) throw err;
  console.log("Connected to the database!");
});

// body-parser 설정
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// 세션 설정
app.use(session({
  secret: 'secret key',
  resave: false,
  saveUninitialized: true,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html');
});

// 사용자 이름을 반환하는 API
app.get('/username', function(req, res) {
    res.send({ username: req.session.username });
});

// POST 요청 처리
app.post('/', function(req, res) {
  var name = req.body.name;

  // 데이터베이스에서 사용자 검색
  db.query("SELECT * FROM users WHERE name = ?", [name], function(err, result) {
    if (err) throw err;

    // 사용자가 이미 존재하는 경우
    if (result.length > 0) {
      res.json({ message: "이미 존재하는 이름입니다." });
    }
    // 사용자가 존재하지 않는 경우
    else {
      db.query("INSERT INTO users (name) VALUES (?)", [name], function(err, result) {
        if (err) throw err;
        // 세션에 사용자 이름 저장
        req.session.username = name;
        res.json({ redirect: '/game.html' });
      });
    }
  });
});

//게임 오버
app.post('/gameover', function(req, res) {
  var name = req.body.name;
  var score = req.body.score;
  console.log(`${name}, ${score}`)

  db.query("UPDATE users SET score = ? WHERE name = ?", [score, name], function(err, result) {
    if (err) throw err;
    res.json({ redirect: '/Leaderboard.html' });
  });
});

//리더보드
app.get('/leaderboard', function(req, res) {
  let sql = 'SELECT * FROM users ORDER BY score DESC';
  db.query(sql, function(err, result) {
    if (err) throw err;
    res.json(result);
  });
});

app.listen(3000, function() {
  console.log('App is listening on port 3000!');
});
