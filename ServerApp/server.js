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
		// res.send(401, 'You are not authorized to view this page');
		next();
	} 
	else {
		next();
	}
};

function deleteBacklog(time) {
	var ret;
	var sql = `DELETE FROM backlogs WHERE time = ${time}`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		ret = {"message": "deleted from backlog"};
	});
};

function listEvents() {
	var ret;
	var sql = "SELECT * FROM events";
	con.query(sql, function (err, result) {
		if (err) throw err;
		ret =  JSON.stringify(result);
	});
};

// function addEvent(time, lamp_id, action) {
// 	var ret = null;
// 	var sql = `INSERT INTO events (time, lamp_id, action) VALUES ('${time}', '${lamp_id}', '${action}')`;
// 	con.query(sql, function (err, result) {
// 		if (err) throw err;
// 		ret =  {"message": "Insert succesfully into events"};
// 	});
// 	reutrn ret;
// };


app.get('/api/login/:username/:pwdHashed', function(req, res){
	username = req.params['username'];
	pwdHashed = req.params['pwdHashed'];
	pwdHashed = passwordHash.generate('Estiri');
	var sql = `SELECT password FROM users WHERE username = '${username}'`;
	con.query(sql, function (err, result) {
	  if (err) throw err;
	  if (passwordHash.verify(result[0]['password'], pwdHashed)) {
		req.session.user_id = username;
		res.end({"message": 'Login successfull'});
	} 
	else {
		res.end({"message": "Login failed"});
	}
	});
});

app.get('/api/logout', function (req, res) {
	user = req.session.user_id
	delete req.session.user_id;
	res.end({"message": `${user} logout`});
});

app.get('/api/addBacklog/:time/:lid/:action', checkAuth, function (req, res) {
	time = req.params['time']
	lid = req.params['lid']
	action = req.params['action']
	var sql = `INSERT INTO backlog (time, lamp_id, action) VALUES ('${time}', '${lid}', '${action}')`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end({"message": "Insert succesfully into backlog"});
	});
});

app.get('/api/listBacklogs/:time', checkAuth, function (req, res) {
	time = req.params['time']
	var sql = `SELECT * FROM backlogs WHERE time = ${time}`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		res.end(JSON.stringify(result));
	});
});

app.get('/api/getEnergySaved/:lid', checkAuth, function (req, res) {
	lid = req.params['lid'];
	res.end({"message": 100});
	// TODO: Calculate saved energy
});

app.get('/api/changeLampState/:lid', checkAuth, function(req, res) {
	var lid = req.params['lid'];
	var state = "ON";
	var id;
	var sql = `SELECT * FROM events WHERE lamp_id = ${lid} ORDER BY time DESC LIMIT 1`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (result[0]) {
			id = result[0]["id"];
			if (result[0]["action"] == "ON"){
				state = "OFF";
			}
		}
	});
	var now = new Date();
	h = now.getHours();
	m = now.getMinutes();
	s = now.getSeconds();
	now = `${h}:${m}:${s}`;
	var sql2 = `INSERT INTO events (time, lamp_id, action) VALUES ('${now}', '${lid}', '${state}')`;
	console.log(sql2);
	con.query(sql2, function (err, result) {
		if (err) throw err;
		res.end(JSON.stringify({"message": state}));
	});
});

app.get('/api/getLampState/:lid', checkAuth, function(req, res) {
	var lid = req.params['lid'];
	var sql = `SELECT * FROM events WHERE lamp_id = ${lid} ORDER BY time DESC LIMIT 1`;
	con.query(sql, function (err, result) {
		if (err) throw err;
		if (result[0]) {
			res.end(JSON.stringify({"message": result[0]["action"]}));
		} else {
			res.end(JSON.stringify({"message": "OFF"}));
		}
	});
});

var server = app.listen(8081, function () {
   var host = server.address().address
   var port = server.address().port
   console.log("Server listening at http://localhost:%s", port)
});

console.log("ca")