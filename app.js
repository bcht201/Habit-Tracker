var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;

var users = require('./routes/users');
var activity = require('./routes/activity');

//So that Express can read form data/ body of HTTP Request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/users', users);
app.use('/activity', activity);

app.listen(port, () => console.log(`Listening to port ${port}!!`));

module.exports = app;
