var mysql = require('mysql2');
var db = mysql.createConnection({
    host: 'localhost',
    user: 'younjin',
    password: 'younjin',
    database: 'crop_info'
});
db.connect();

module.exports = db;