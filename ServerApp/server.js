
// Add libraries
const hostname = '127.0.0.1';
const port = 3000;
var express = require('express');
var app = express();
var fs = require("fs");
var passwordHash = require('password-hash');
var session = require('express-session');
var bodyParser = require('body-parser');
var mysql = require('mysql');

// Connect to database
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "nodejsiot",
	database: "iotdb"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
})

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		// res.send(401, 'You are not authorized to view this page');
		next();
	} 
	else {
		next();
	}
};

app.get('/api/login/:username/:pwdHashed', function(req, res){
	username = req.params['username'];
	pwdHashed = req.params['pwdHashed'];
	pwdHashed = passwordHash.generate('Estiri');
	var sql = `SELECT password FROM users WHERE username = '${username}'`;
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  if (passwordHash.verify(result[0]['password'], pwdHashed)) {
		req.session.user_id = username;
		res.send({"message": 'Login successfull'});
	} 
	else {
		res.send({"message": "Login failed"});
	}
	});
});

app.get('/api/logout', function (req, res) {
	user = req.session.user_id
	delete req.session.user_id;
	res.send({"message": `${user} logout`});
});

app.get('/api/changeLampState/:lid', checkAuth, function(req, res) {
	console.log("estiri :))")
});

app.get('/api/changeLampStateAdmin/:lid', checkAuth, function(req, res) {
	res.send({"message": "ON"})
});

app.get('/api/getCostAdmin', checkAuth, function(req, res) {
	res.send({"message": 1000})
});

app.get('/api/getLampState/:lid', checkAuth, function(req, res) {
	var lid = req.params['lid'];
    if (true){
        res.send("ON");
    } else {
        res.send("OFF");
    }
});

app.get('/api/getLampStateAdmin/:lid', checkAuth, function(req, res) {
	var lid = req.params['lid'];
    if (lid == "1" || lid == "2"){
        res.send({"message": "ON"});
    } else {
        res.send({"message": "OFF"});
    }
});

app.get('/api/triggerSensor/:lid/:time', checkAuth, function(req, res) {
	var lid = req.params['lid'];
	var time = req.params['time'];
	res.send("Successful");
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at http://localhost:%s", port)
 });

