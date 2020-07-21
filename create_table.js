var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "nodejsiot",
  database: "iotdb"
});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
  var sql1 = "CREATE TABLE events (event_id INT AUTO_INCREMENT PRIMARY KEY, time TIME, lamp_id VARCHAR(255), action ENUM('ON', 'OFF'))";
  var sql2 = "CREATE TABLE backlog (time TIME, lamp_id VARCHAR(255), action ENUM('ON', 'OFF'))";
  var sql3 = "CREATE TABLE users (username VARCHAR(255) PRIMARY KEY, password VARCHAR(255))";
  con.query(sql1, function (err, result) {
    if (err) throw err;
    console.log("Events table created");
  });
  con.query(sql2, function (err, result) {
    if (err) throw err;
    console.log("Backlog table created");
  });
  con.query(sql3, function (err, result) {
    if (err) throw err;
    console.log("Users table created");
  });
});