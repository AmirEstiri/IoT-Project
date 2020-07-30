# IoT_Project

## Project Setup
Download node for your desired OS.\
Download My-Sql Server for the desired OS.\
Setup a My-Sql database on your localhost machine.\
Clone the repository, cd into the folder and install the necessary packages with the command below:\
`npm install package_name`

## Database Setup
Run `node create_db.js` in terminal to create a database named `iotdb`.\
If you encounter any error in this step, run the following queries in your My-Sql workbench:\
`ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password'`\
`flush privileges`\
Run `create_table.js` like before to create the necessary tables for events, backlogs and users.\
Run `add_users.js` and `add_events.js` to add some sample data to the existing tables.

## Server Setup
Run `server.js` to create an instance of the server on the 8081 port of your localhost machine to listen to incoming requests.
Below you can see the requests handled by the server and the actions taken:\
1. /auth/:username/:password_hashed\
Check the username and the hashed password(SHA1) with the ones existing in database and authorize the access.
2. /logout\
Logout the existing user from server.
3. /events\
List all the events in the database in JSON form only if the access is authorized.
4. /addEvent/:time/:lid/:action\
Add event with the specified time for the specified lamp with the specified action in the events database, only if the access is authorized.
5. /addBacklog/:time/:lid/:action\
Add backlog with the specified time for the specified lamp with the specified action in the backlogs database, only if the access is authorized.
6. /listBacklogs/:time\
List all the backlogs in the specified time in JSON form for authorized access.
7. /deleteBacklog/:time\
Delete all the backlogs in the specified time for authorized access.
