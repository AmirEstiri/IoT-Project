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
    var sql = "INSERT INTO events (time, lamp_id, action) VALUES ?";
    var values = [
      ['8:12:32', '3', 'ON'],
      ['9:10:31', '3', 'OFF'],
    ];
    con.query(sql, [values], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
    });
  });