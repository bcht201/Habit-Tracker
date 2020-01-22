var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var mongoose = require ('mongoose');
var environment = process.env.NODE_ENV || 'development';

var dbName = `activity_${environment}`;
var activity = require (`./db/schema/activity_${environment}`);
var mongoDB = `mongodb://127.0.0.1/${dbName}`;
mongoose.connect(mongoDB, {useNewUrlParser : true});

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//So that Express can read form data/ body of HTTP Request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) =>{
    res.send('hello world')
})

app.get('/showActivity', (req,res) =>{
    activity.find({}, '_id title', (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        console.log('dbName: ', dbName);
        res.json(entries);
    })
})

app.post('/newActivity', (req, res) =>{
    const newActivity = new activity(req.body);
    newActivity.save().then(addedActivity =>{
        console.log(addedActivity);
        res.status(200).json({
            message: "Handling POST requests to testEntry",
            entry: addedActivity
        })
    }).catch( err => console.log(err));
})

//To be removed when done 
app.get('/dropDB', (req,res) =>{
    activity.deleteMany({}, (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.send("All deleted");
    })
})

app.listen(port, () => console.log(`Listening to port ${port}!!`));

module.exports = app;
