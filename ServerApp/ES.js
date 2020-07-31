
// Add libraries
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

// Activate sessions for log in/log out
app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

// Authorization for admins
function checkAuth(req, res, next) {
	if (!req.session.user_id) {
		// res.send(401, 'You are not authorized to view this page');
		next();
	} 
	else {
		next();
	}
};


// Time variables.

var time = 0;


// Convert times.

function toSecond(s) {
    var parts = s.split(":");
    var t = (parseInt(parts[0], 10) * 60 * 60) +
        (parseInt(parts[1], 10) * 60) +
        (parseInt(parts[2], 10));
    return t;
}

function sec2time(timeInSeconds) {
        let hours = Math.floor(timeInSeconds / 60 / 60);
        let minutes = Math.floor(timeInSeconds / 60) % 60;
        let seconds = timeInSeconds % 60;
    return hours.toString(10) + ':' + minutes.toString(10) + ':' + seconds.toString(10);
}


// This is the Cost class.

class Cost {

    CostPerSecond;
    CostPerTurnOn;

    constructor(CostPerSecond, CostPerTurnOn) {
        this.CostPerSecond = CostPerSecond;
        this.CostPerTurnOn = CostPerTurnOn;
    }

    getCostPerSecond() {
        return this.CostPerSecond;
    }

    getCostPerTurnOn() {
        return this.CostPerTurnOn;
    }
}


// This is the Lamp class.

class Lamp {

    ID = "NULL";
    State = false;

    DistanceToSensor;
    EssentialDistance;
    EnoughDistance;

    start = 1000000000000;
    end = -1;

    Cost = null;
    CostValue = 0;

    waitingArray = [];

    constructor(ID, DistanceToSensor, EssentialDistance, EnoughDistance) {
        this.ID = ID;
        this.DistanceToSensor = DistanceToSensor;
        this.EssentialDistance = EssentialDistance;
        this.EnoughDistance = EnoughDistance;
    }

    setCost(Cost) {
        this.Cost = Cost;
    }

    update(time, v) {
        const start = Math.floor((this.DistanceToSensor - this.EssentialDistance) / v) + time;
        const end = Math.floor(this.EnoughDistance + this.DistanceToSensor / v) + 1 + time;
        if (start < this.start) {
            this.start = start;
        }
        if (this.end < end) {
            this.end = end;
        }
    }

    addEvent(time, v, distance) {
        const value = Math.floor(this.DistanceToSensor - this.EssentialDistance + distance / v) + time;
        this.waitingArray.push(value);
    }

    execute() {

        if (this.State) {
            this.CostValue += this.Cost.getCostPerSecond();
        }

        if (this.start <= time && time < this.end && !this.State) {
            this.State = true;
            this.CostValue += this.Cost.getCostPerTurnOn();
            return;
        }

        if (time >= this.end && this.State) {

            for (let i = 0; i < this.waitingArray.length; i++) {
                let x = this.waitingArray[i];
                if (x >= time && this.Cost.getCostPerTurnOn() >= (x - time) * this.Cost.getCostPerSecond()){
                    return;
                }
            }

            this.State = false;
        }
    }

    turnOn() {
        this.CostValue += this.Cost.getCostPerTurnOn();
        this.State = true;
    }

    turnOff() {
        this.state = false;
    }

    toggle() {
        if (this.state) {
            this.turnOff();
        } else {
            this.turnOn();
        }
    }

    resetCost() {
        this.CostValue = 0;
    }

    getID() {
        return this.ID;
    }

    getState() {
        return this.State;
    }

    getCostValue() {
        return this.CostValue;
    }
}


// This is the Main Class.

class City {

    Lamps = [];
    Distances = [];
    Cost;
    CostValue = 0;

    addLamp(Lamp) {
        this.Lamps.push(Lamp);
    }

    addDistance(distance) {
        this.Distances.push(distance);
    }

    setCost(Cost) {
        this.Cost = Cost;
        for (let i = 0; i < this.Lamps.length; i++) {
            this.Lamps[i].setCost(this.Cost);
        }
    }

    update(ID, time, v) {

        for (let i = 0; i < this.Lamps.length; i++) {
            if (this.Lamps[i].getID() === ID) {
                this.Lamps[i].update(time, v);
                break;
            }
        }

        for (let i = parseInt(ID); i < this.Lamps.length; i++) {
            this.Lamps[i].addEvent(time, v, this.Distances[i - 1]);
        }
    }

    execute() {
        for (let i = 0; i < this.Lamps.length; i++) {
            this.Lamps[i].execute();
        }
    }

    turnOn(ID) {
        for (let i = 0; i < this.Lamps.length; i++) {
            if (this.Lamps[i].getID() === ID) {
                this.Lamps[i].turnOn();
                break;
            }
        }
    }

    turnOff(ID) {
        for (let i = 0; i < this.Lamps.length; i++) {
            if (this.Lamps[i].getID() === ID) {
                this.Lamps[i].turnOff();
                break;
            }
        }
    }

    toggle(ID) {
        for (let i = 0; i < this.Lamps.length; i++) {
            if (this.Lamps[i].getID() === ID) {
                this.Lamps[i].toggle();
                break;
            }
        }
    }

    computeCost() {
        this.CostValue = 0;
        for (let i = 0; i < this.Lamps.length; i++) {
            this.CostValue += this.Lamps[i].getCostValue();
        }
    }

    resetCost() {
        this.CostValue = 0;
        for (let i = 0; i < this.Lamps.length; i++) {
            this.Lamps[i].resetCost();
        }
    }

    getStates() {
        var states = [];
        for (let i = 0; i < this.Lamps.length; i++) {
            states.push(this.Lamps[i].getState());
        }
        return states;
    }

    getLamps() {
        return this.Lamps;
    }

    getDistances() {
        return this.Distances;
    }

    getCostValue() {
        return this.CostValue;
    }
}


// Initialization:

cost = new Cost(1, 100);

const n = 4;
lamp1 = new Lamp("1", 15, 10, 5);
lamp2 = new Lamp("2", 15, 10, 5);
lamp3 = new Lamp("3", 15, 10, 5);
lamp4 = new Lamp("4", 15, 10, 5);

city = new City();
city.addLamp(lamp1);
city.addLamp(lamp2);
city.addLamp(lamp3);
city.addLamp(lamp4);
city.addDistance(10);
city.addDistance(20);
city.addDistance(20);
city.setCost(cost);

const V0 = 2;


// Main Loop.

every = 1000;
setInterval(function(){
    updateSystem();
}, every);

function updateSystem() {

    // Time.

    //TODO: change time format to 24h
    var timeString = new Date().toLocaleTimeString().substr(0, 8);
    // date.getDate();
    // let timeString = date.toISOString().substr(11, 8);
    time = toSecond(timeString) + 12 * 3600;
    // console.log(date);


    // Main actions!

    city.computeCost();

    city.execute();
    let new_states = city.getStates();


    // Database.

    let tempTime = sec2time(time);

    var sql1 = "";
    if (new_states[0]){
        sql1 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '1', 'ON');";
    } else {
        sql1 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '1', 'OFF');";
    }
    con.query(sql1, [tempTime], function (err, result) {
        if (err) throw err;
    });

    var sql2 = "";
    if (new_states[1]){
        sql2 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '2', 'ON');";
    } else {
        sql2 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '2', 'OFF');";
    }
    con.query(sql2, [tempTime], function (err, result) {
        if (err) throw err;
    });

    var sql3 = "";
    if (new_states[2]){
        sql3 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '3', 'ON');";
    } else {
        sql3 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '3', 'OFF');";
    }
    con.query(sql3, [tempTime], function (err, result) {
        if (err) throw err;
    });

    var sql4 = "";
    if (new_states[3]){
        sql4 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '4', 'ON');";
    } else {
        sql4 = "INSERT INTO events(time, lamp_id, action) VALUES(?, '4', 'OFF');";
    }
    con.query(sql4, [tempTime], function (err, result) {
        if (err) throw err;
    });
}


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

app.get('/api/getEnergySaved', checkAuth, function (req, res) {
	res.end({"message": city.getCostValue()});
});

app.get('/api/changeLampState/:lid', checkAuth, function(req, res) {
    var lid = req.params['lid'];
    city.toggle(lid);
});

app.get('/api/triggerSensor/:lid/:time', checkAuth, function(req, res) {
	var lid = req.params['lid'];
    var time = req.params['time'];
    console.log(time);
    city.update(lid, toSecond(time), V0);
	res.end("Successful");
});

app.get('/api/getLampState/:lid', checkAuth, function(req, res) {
    var lid = req.params['lid'];
    states = city.getStates();
    console.log(`lid: ${lid}, states: ${states}`);
    if (states[lid-1]){
        res.send("ON");
    } else {
        res.send("OFF");
    }
});

app.get('/api/getLampStateAdmin/:lid', checkAuth, function(req, res) {
    var lid = req.params['lid'];
    states = city.getStates();
    if (states[lid-1]){
        res.send({"message": "ON"});
    } else {
        res.send({"message": "OFF"});
    }
});

var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("Server listening at http://localhost:%s", port)
 });


