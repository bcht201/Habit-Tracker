var environment = process.env.NODE_ENV || 'development';
const User = require(`./db/schema/user_schema_${environment}`);
const Activity = require(`./db/schema/activity_schema_${environment}`);
var mongoose = require ('mongoose');
var moment = require('moment');
var mongoDB = `mongodb://127.0.0.1/habit_tracker_${environment}`;
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
        res.status(500).send("name is missing");
    }
    
}

const newActivity = (req, res)=>{
    let deadlineVal;
    let completedVal;
    let streakVal;
    let midnightTMR = moment().add(1 ,'days').startOf('day').toDate();

    if(environment === 'test'){
        deadlineVal = req.body.deadline;
        completedVal = req.body.complete
        streakVal = req.body.streak
    }
    else{
        deadlineVal = midnightTMR;
        completedVal = false;
        streakVal = 0;
    }
    let activityObj = new Activity({
        _id: new mongoose.Types.ObjectId(),
        userID: req.body.userID,
        name: req.body.name,
        frequency: req.body.frequency,
        deadline: deadlineVal,
        completedTodayNum: 0,
        lastCompleted: null,
        completedToday: completedVal,
        streak: streakVal
    });
    activityObj.save().then((addedActivity) =>{
        console.log(addedActivity);
        User.findOneAndUpdate({_id: addedActivity.userID}, {$push: {activities: addedActivity._id}}, {new:true})
            .then(updatedUser =>{
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
    let activityID = req.params.activityID;
    //Implement check/ update on fetch of activites as well
    Activity.find({_id: activityID}, (err, results) =>{
        if(err) res.status(500).send(err);
        if(results[0].completedToday === true && moment().isBefore(results[0].deadline)){
            res.json({
                message: "Task already completed for today"
            });
        }
        else{
            Activity.findOneAndUpdate({_id: activityID}, { $set: changes(results)}, {new:true})
            .then((updatedActivity) =>{
                res.status(200).send(updatedActivity);
            })
        }
    })
}

const changes = (activity) =>{
    let changes = {};
    let completedTodayAdd1 = activity[0].completedTodayNum + 1;
    let streakAdd1 = activity[0].streak + 1;

    if(moment().isAfter(activity[0].deadline)){
        //After deadline > 1 day == reset
        if(moment(activity[0].deadline).add(1, 'days').isBefore(moment()) || !activity[0].completedToday){
            changes.streak = 0;
        }
        //After deadline < 1 day && completed previous day == continue streaking
        //Either way have to reset count for today and completion status
        changes.completedTodayNum = 1;
        changes.completedToday= false;
    }

    //Not completed && before deadline
    else if(moment().isBefore(activity[0].deadline)){
        if(completedTodayAdd1 === activity[0].frequency){
            // console.log('streaking');
            changes.streak = streakAdd1;
            changes.completedTodayNum = 0;
            changes.completedToday = true;
            changes.lastCompleted = moment().toDate();
        }
        //Not completed && before deadline == +1 
        else{
            // console.log('+1 task frequency');
            changes.completedTodayNum = completedTodayAdd1;
        }
    }
    changes.deadline = moment().add(1 ,'days').startOf('day').toDate();
    return changes;
}

const updateActivity = (req, res) =>{
    let changedField = req.query.field.toString();
    let newData = req.query.newData;

    if(!req.query.activity || !req.query.field || !req.query.newData){
        res.status(500).send('Please ensure all necessary queries are in request')
    }

    //Associative array
    let changes = {};
    //Set array key as changedField to have value of new data 
    changes[changedField] = newData;

    //Set a key value pair, before was setting an object in an object
    Activity.findOneAndUpdate({_id: req.query.activity}, {$set: changes}, {new: true})
    .then(updatedActivity =>{
        res.status(200).send(updatedActivity);
    })
}

const deleteActivity = (req, res)=>{
    if(!req.params.activityID){
        res.status(500).send('Please specify activity to delete');
    }
    Activity.findByIdAndDelete( req.params.activityID, function (err, data){
        if(err) res.status(500).send(err) 
        else{
            res.status(200).send(data);
        }
        
    })
}

module.exports = {
    getAllUsers,
    getSpecificUser,
    addUser,
    newActivity,
    getUserActivities,
    completeActivity,
    updateActivity,
    deleteActivity
}