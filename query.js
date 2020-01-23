const User = require('./db/schema/user_schema');
const Activity = require('./db/schema/activity_schema');
var mongoose = require ('mongoose');
const moment = require('moment');
var environment = process.env.NODE_ENV || 'development';
var dbName = `habit_tracker_${environment}`;
var mongoDB = `mongodb://127.0.0.1/${dbName}`;
mongoose.connect(mongoDB, {useNewUrlParser : true});

//Get the default connection
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const getAllUsers = (req, res) =>{
    User.find({}, 'name', (err, entries)=>{
        if(err) console.log(err);
        res.json(entries);
    });
};

const getSpecificUser = (req, res)=>{
    User.find({_id: req.params.ID}, 'name', (err, entries)=>{
        if(err) console.log(err);
        res.json(entries);
    });
}

const addUser = (req, res) =>{
    if(req.body.name){
        const newUser = new User({
            name: req.body.name,
            activities: []
        });
        newUser.save().then(addedUser =>{
            res.status(200).json({
                entry: addedUser
            })
        });
    }
    else{
        res.redirect('/users');
    }
    
}

const newActivity = (req, res)=>{
    let activityObj = new Activity({
        _id: new mongoose.Types.ObjectId(),
        userID: req.body.userID,
        name: req.body.name,
        frequency: req.body.frequency,
        deadline: moment().add(1 ,'days').startOf('day'),
        completedTodayNum: 0,
        lastCompleted: null,
        completedToday: false,
        streak: 0
    });
    activityObj.save().then(addedActivity =>{
        User.findOneAndUpdate({_id: addedActivity.userID}, {$push: {activities: addedActivity._id}}, {new:true})
            .then(updatedUser =>{
                console.log('updated user json', updatedUser);
                res.send(updatedUser);
            });
    });
}

const getUserActivities = (req, res)=>{
    if(req.query.complete && req.query.user){
        Activity.find({userID : req.query.user, completedToday: req.query.complete}, (err, results) =>{
            if (err) console.log(err);
            res.json(results);
        })
    }
    else if(req.query.user){
        Activity.find({userID : req.query.user}, (err, results) =>{
            if (err) console.log(err);
            res.json(results);
        })
    }
    else{
        res.json({
            message: 'incorrect parameters, please specify a user'
        })
    }
}

const completeActivity = (req, res) =>{
    Activity.find({_id: req.params.activityID}, (err, results) =>{
        if(results.completedToday && moment().isBefore(results.deadline)){
            res.json({
                message: "Task already completed for today"
            });
        }
        else if(!results.completedToday && moment().isBefore(results.deadline)){
            //either completedTodayNum++, resetCTN && streak++
            updateActivity(results.frequency, results.completedTodayNum);
        }
        else if(moment().isAfter(results.deadline)){
            //Today is > 1 day after deadline == reset
            //Did not meet goal and past last recorded deadline == reset
            //results.completedToday && Today > deadline by less than 24 hours == update
        }
    })
}

const resetActivity = (activityID) =>{
    Activity.findOneAndUpdate({_id: activityID}, {$set: {
        deadline: moment().add(1 ,'days').startOf('day'),
        completedTodayNum: 1,

    }})
}

module.exports = {
    getAllUsers,
    getSpecificUser,
    addUser,
    newActivity,
    getUserActivities,
    completeActivity
}