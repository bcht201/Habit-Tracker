var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var mongoose = require ('mongoose');
var dbName = 'mongooseDBTest';
var mongoDB = `mongodb://127.0.0.1/${dbName}`;

var TestEntry = require ('./db/schema/testEntry');
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

app.get('/testEntry', (req,res) =>{
    TestEntry.find({}, '_id title', (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.json(entries);
    })
})

app.get('/dropDB', (req,res) =>{
    TestEntry.find({}, '_id title', (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.json(entries);
    })
})

app.post('/testEntry', (req, res) =>{
    const testItem = new TestEntry(req.body);
    testItem.save().then(testItem =>{
        console.log(testItem);
        res.status(201).json({
            message: "Handling POST requests to testEntry",
            entry: testItem
        })
    }).catch( err => console.log(err));
})

app.listen(port, () => console.log(`Listening to port ${port}!!`))