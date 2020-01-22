var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var mongoose = require ('mongoose');
var dbName = 'mongooseDBTest';
var mongoDB = `mongodb://127.0.0.1/${dbName}`;

mongoose.connect(mongoDB, {useNewUrlParser : true});

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//So that Express can read form data
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.send('hello world')
})

app.post('/testEntry', (req, res) =>{
    
})

app.listen(port, () => console.log(`Listening to port ${port}!!`))