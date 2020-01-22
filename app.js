var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var mongoose = require ('mongoose');
var dbName = 'activity';
var mongoDB = `mongodb://127.0.0.1/${dbName}`;

var activity = require ('./db/schema/activity');
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
        res.json(entries);
    })
})

// app.get('/dropDB', (req,res) =>{
//     activity.deleteMany({}, (err, entries)=>{
//         if(err) console.log(err);
//         console.log(entries);
//         res.send("All deleted");
//     })
// })

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

app.listen(port, () => console.log(`Listening to port ${port}!!`));

module.exports = app;
