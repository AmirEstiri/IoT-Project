var express = require('express');
var app = express();
var fs = require("fs");
var passwordHash = require('password-hash');
var session = require('express-session');
var bodyParser = require('body-parser');
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
	  res.send('You are not authorized to view this page');
	} 
	else {
		next();
	}
}

app.get('/auth/:username/:pwdHashed', function(req, res){
	username = req.params['username'];
	pwdHashed = req.params['pwdHashed'];
	pwdHashed = passwordHash.generate('Estiri');
	var sql = `SELECT password FROM users WHERE username = '${username}'`;
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  if (passwordHash.verify(result[0]['password'], pwdHashed)) {
		req.session.user_id = username;
		res.end('Login successfull');
	} 
	else {
		res.end('Login failed');
	}
	});
});

app.get('/logout', function (req, res) {
	user = req.session.user_id
	delete req.session.user_id;
	res.end(`${user} logout`);
});

app.get('/events', checkAuth, function (req, res) {
	var sql = "SELECT * FROM events";
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.get('/addEvent/:time/:lid/:action', checkAuth, function (req, res) {
	time = req.params['time']
	lid = req.params['lid']
	action = req.params['action']
	var sql = `INSERT INTO events (time, lamp_id, action) VALUES ('${time}', '${lid}', '${action}')`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end("Insert succesfully into events");
	});
});

app.get('/addBacklog/:time/:lid/:action', checkAuth, function (req, res) {
	time = req.params['time']
	lid = req.params['lid']
	action = req.params['action']
	var sql = `INSERT INTO backlog (time, lamp_id, action) VALUES ('${time}', '${lid}', '${action}')`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end("Insert succesfully into backlog");
	});
});

app.get('/listBacklogs/:time', checkAuth, function (req, res) {
	time = req.params['time']
	var sql = `SELECT * FROM backlogs WHERE time = ${time}`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.get('/deleteBacklog/:time', checkAuth, function (req, res) {
	time = req.params['time']
	var sql = `DELETE FROM backlogs WHERE time = ${time}`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end("deleted from backlog");
	});
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Server listening at http://localhost:%s", port)
});