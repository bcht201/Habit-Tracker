var express = require ('express');
var app = express();
var bodyParser = require('body-parser');
var port = 8080;
var mongoose = require ('mongoose');
var environment = process.env.NODE_ENV || 'development';

var dbName = `habit_tracker_${environment}`;
var user = require (`./db/schema/user_schema_${environment}`);
var activity = require (`./db/schema/activity_schema_${environment}`);
var mongoDB = `mongodb://127.0.0.1/${dbName}`;
mongoose.connect(mongoDB, {useNewUrlParser : true});

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//So that Express can read form data/ body of HTTP Request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/showAllUsers', (req,res) =>{
    user.find({}, 'name', (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.json(entries);
    })
})

app.get('/habits/:userID', (req,res) =>{
    user.findById(req.params.userID).populate('activities').exec((err, results)=>{
        if (err) console.log(err);
        console.log('activity name:', results.activities);
        res.json(results);
    });
});

app.post('/newUser', (req,res) =>{
    const newUser = new user({
        name: req.body.name,
        activities: []
    });
    newUser.save().then(addedUser =>{
        console.log(addedUser);
        res.status(200).json({
            message: "Adding new user into DB through schema",
            entry: addedUser
        })
    })
});

app.post('/newActivity', (req,res) =>{
    const newActivity = new activity({
        _id: new mongoose.Types.ObjectId(),
        user: req.body.userID,
        name: req.body.name,
        frequency: req.body.frequency,
        timeframe: req.body.timeframe,
        deadline: Date.now(),
        completedPerTimeframe: 0,
        lastCompleted: null,
        completed: false,
        streak: 0
    });
    newActivity.save().then(addedActivity =>{
        user.findOneAndUpdate({_id: addedActivity.user}, {$push: {activities: addedActivity._id}}, {new:true})
            .then(updatedUser =>{
                console.log('updated user json', updatedUser);
                res.send(updatedUser);
            });
    });
});

// app.post('/newActivity', (req, res) =>{
//     const newActivity = new activity(req.body);
//     newActivity.save().then(addedActivity =>{
//         console.log(addedActivity);
//         res.status(200).json({
//             message: "Handling POST requests to testEntry",
//             entry: addedActivity
//         })
//     }).catch( err => console.log(err));
// })

//To be removed when done 
app.get('/dropUser', (req,res) =>{
    user.deleteMany({}, (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.send("All deleted");
    })
})

app.get('/dropActivity', (req,res) =>{
    activity.deleteMany({}, (err, entries)=>{
        if(err) console.log(err);
        console.log(entries);
        res.send("All deleted");
    })
})

app.listen(port, () => console.log(`Listening to port ${port}!!`));

module.exports = app;
