const express = require('express')
const session = require('express-session')
const path = require('path');
const app = express()
const port = 5000

const cors = require('cors');
app.use(cors());

const db = require('./lib/db');
const sessionOption = require('./lib/sessionOption');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

app.use(express.static(path.join(__dirname, '/build')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var MySQLStore = require('express-mysql-session')(session);
var sessionStore = new MySQLStore(sessionOption);
app.use(session({  
	key: 'session_cookie_name',
    secret: '~',
	store: sessionStore,
	resave: false,
	saveUninitialized: false
}))


app.post("/crop", (req, res) => {  // 데이터 받아서 결과 전송
    const name = req.body.cropName;
    const type = req.body.cropType;
    const date = req.body.cropDate;
    const location = req.body.cropLocation;
    const state = req.body.cropState;
    res.send(req.body.cropName);
    
    const sendData = { isSuccess: "" };


    if (name) {
        db.query('SELECT * FROM croptable WHERE name = ?', [name], function(error, results, fields) { // DB에 같은 이름의 회원아이디가 있는지 확인
            if (error) throw error;
            if (results.length <= 0) {         // DB에 같은 이름의 회원아이디가 없고, 비밀번호가 올바르게 입력된 경우
                db.query('INSERT INTO croptable (name, type, date, location, state) VALUES(?,?,?,?,?)', [name, type, date, location, state], function (error, data) {
                });
            } 
            else {                                                  // DB에 같은 이름의 회원아이디가 있는 경우            
                sendData.isSuccess = "이미 존재하는 이름 입니다!"
                res.send(sendData);  
            }            
        });        
    } 
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})