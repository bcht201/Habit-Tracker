process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHTTP = require ('chai-http');
const expect = chai.expect;
var mongoose = require ('mongoose');
var app = require ('../app');
var moment = require('moment');

var dbName = `habit_tracker_${process.env.NODE_ENV}`;
var userTest = require ('../db/schema/user_schema_test');
var activityTest = require ('../db/schema/activity_schema_test');
var mongoDB = `mongodb://127.0.0.1/${dbName}`;

var should = chai.should();
chai.use(chaiHTTP);

describe('Test suite: API Routes', function (){
    var user1;
    var activity1;
    var activity2;
    var activity3;
    before(function (done){
        mongoose.connect(mongoDB, {useNewUrlParser : true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function (){
            console.log('Connected to test database...');
            userTest.deleteMany({}, (err)=>{
                if(err) console.log(err);
                console.log('User resetted');
            })
            .then(() =>{
                activityTest.deleteMany({}, (err)=>{
                    if(err) console.log(err);
                    console.log('Activity resetted');
                })
            })
            .then(()=> done());
        });
    });
    
    after(function(done){
        mongoose.connection.db.dropDatabase(function(){
            mongoose.connection.close(done);
        })
    })

    describe('post /users/addUser', function(){
        it('should add new user into users collection in DB', function(done){
            chai.request(app)
            .post('/users/addUser')
            .send({
                name: 'Brian'
            })
            .end(function(err, res){
                user1 = res.body.entry._id;
                res.should.have.status(200);
                res.body.should.have.property('entry');
                res.body.entry.name.should.equal('Brian');
                res.body.entry.activities.should.be.a('array');
                res.body.entry.activities.should.eql([]);
                done();
            })
        })
    })

    describe('get /users', function(){
        it('should return 1 user', function(done){
            chai.request(app)
            .get('/users')
            .end(function(err, res){
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                done();
            })
        });
    });

    describe('get /users/:ID', function(){
        it('should return 1 user', function(done){
            chai.request(app)
            .get(`/users/${user1}`)
            .end(function(err, res){
                console.log(res.body);
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                res.body[0].name.should.equal('Brian');
                done();
            })
        });
    });

    describe('post /newActivity', function(){
        it('should add new activity into db', function(done){
            chai.request(app)
            .post('/activity/new')
            .send({
                "userID": user1,
                "name": "eating",
                "frequency": "3",
                "deadline": moment().add(1 ,'days').startOf('day').toDate(),
                "complete": false,
                "streak": 0
            })
            .end(function(err, res){
                activity1 = res.body.activities[0];
                res.body.activities.should.have.lengthOf(1);
                done();
            });
        });
        it('should the second activity into db', function(done){
            chai.request(app)
            .post('/activity/new')
            .send({
                "userID": user1,
                "name": "drinking",
                "frequency": "2",
                "deadline": moment().startOf('day').toDate(),
                "complete": true,
                "streak": 1
            })
            .end(function(err, res){
                activity2 = res.body.activities[1];
                res.body.activities.should.have.lengthOf(2);
                done();
            });
        });
        it('should the third activity into db', function(done){
            chai.request(app)
            .post('/activity/new')
            .send({
                "userID": user1,
                "name": "coding",
                "frequency": "100",
                "deadline": moment().subtract(2 ,'days').startOf('day').toDate(),
                "complete": true,
                "streak": 3
            })
            .end(function(err, res){
                activity3 = res.body.activities[2];
                res.body.activities.should.have.lengthOf(3);
                done();
            });
        });
    });

    describe('get /activity', function(){
        it('should return an array of activity info instead of just the ID', function(done){
            chai.request(app)
            .get(`/activity?user=${user1}`)
            .end(function(err, res){
                res.body.should.have.lengthOf(3);
                res.body[0].name.should.equal('eating');
                res.body[0].frequency.should.equal(3);
                res.body[1].name.should.equal('drinking');
                res.body[1].frequency.should.equal(2);
                res.body[2].name.should.equal('coding');
                res.body[2].frequency.should.equal(100);
                done();
            })
        });
        it('should return an array of activity info as it is incomplete', function(done){
            chai.request(app)
            .get(`/activity?user=${user1}&complete=false`)
            .end(function(err, res){
                res.body.should.have.lengthOf(1);
                res.body[0].name.should.equal('eating');
                res.body[0].frequency.should.equal(3);
                res.body[0].completedTodayNum.should.equal(0);
                done();
            })
        });
        it('should return 1 activity info as one are complete', function(done){
            chai.request(app)
            .get(`/activity?user=${user1}&complete=true`)
            .end(function(err, res){
                res.body.should.have.lengthOf(2);
                res.body[0].name.should.equal('drinking');
                res.body[0].frequency.should.equal(2);
                res.body[0].completedTodayNum.should.equal(0);
                res.body[1].name.should.equal('coding');
                res.body[1].frequency.should.equal(100);
                res.body[1].completedTodayNum.should.equal(0);
                done();
            })
        });
        it('should return nothing when parameters are incorrectly inputted', function(done){
            chai.request(app)
            .get(`/activity?user=${user1}&complete=wrong`)
            .end(function(err, res){
                res.body.should.have.lengthOf(0);
                done();
            })
        });
    });
    describe('put /activity/complete/:activityID', function(){
        it('should increment completedToday by 1', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity1}`)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.completedTodayNum.should.equal(1);
                done();
            });
        });
        it('should increment completedToday to 2', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity1}`)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.completedTodayNum.should.equal(2);
                done();
            });
        });
        it('should streak++, mark event as complete for today', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity1}`)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.completedTodayNum.should.equal(0);
                res.body.streak.should.equal(1);
                res.body.completedToday.should.equal(true);
                done();
            });
        });
        it('should return message saying task is already complete', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity1}`)
            .end(function(err, res){
                res.should.be.json;
                res.body.message.should.equal("Task already completed for today");
                done();
            });
        });
        it('should update streaking habit', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity2}`)
            .end(function(err, res){
                res.should.be.json;
                res.body.completedTodayNum.should.equal(1);
                res.body.completedToday.should.equal(false);
                res.body.streak.should.equal(1);
                done();
            });
        });
        it('should update outdated habit', function(done){
            chai.request(app)
            .put(`/activity/complete/${activity3}`)
            .end(function(err, res){
                res.should.be.json;
                res.body.completedTodayNum.should.equal(1);
                res.body.completedToday.should.equal(false);
                res.body.streak.should.equal(0);
                done();
            });
        });
    });
    describe('put /activity/edit?activity=ID&field=name&newData=newEntry', function(){
        it('should return error with missing field: Activity ID', function(done){
            chai.request(app)
            .put(`/activity/edit?field=name&newData=crying`)
            .end(function(err, res){
                console.log(res);
                res.should.have.status(500);
                res.text.should.equal('Please ensure all necessary queries are in request');
                done();
            });
        });
        it('should return error with missing field: Data', function(done){
            chai.request(app)
            .put(`/activity/edit?activity=${activity3}&field=name`)
            .end(function(err, res){
                console.log(res);
                res.should.have.status(500);
                res.text.should.equal('Please ensure all necessary queries are in request');
                done();
            });
        });
        // it('should return error with missing field: Field name', function(done){
        //     chai.request(app)
        //     .put(`/activity/edit?activity=${activity3}&newData=crying`)
        //     .end(function(err, res){
        //         console.log(res);
        //         res.should.have.status(500);
        //         res.text.should.equal('Please ensure all necessary queries are in request');
        //         done();
        //     });
        // });
        it('should update activity field with new data', function(done){
            chai.request(app)
            .put(`/activity/edit?activity=${activity3}&field=name&newData=crying`)
            .end(function(err, res){
                res.should.have.status(200);
                res.body.name.should.equal('crying');
                done();
            });
        });
    });
    describe('delete /:activityID', function(){
        it('should delete a field when ID is provided and valid', function(done){
            chai.request(app)
            .delete(`/activity/${activity2}`)
            .end(function (err, res){
                res.should.have.status(200);
                done();
            })
        })
        it('should return 2 items when calling all activities', function(done){
            chai.request(app)
            .get(`/activity?user=${user1}`)
            .end(function(err, res){
                console.log(res);
                res.body.should.have.lengthOf(2);
                res.body[0].name.should.equal('eating');
                res.body[0].frequency.should.equal(3);
                res.body[1].name.should.equal('crying');
                res.body[1].frequency.should.equal(100);
                done();
            })
        })
    })
});


