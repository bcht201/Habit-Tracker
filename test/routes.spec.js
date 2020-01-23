process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHTTP = require ('chai-http');
const expect = chai.expect;
var mongoose = require ('mongoose');
var app = require ('../app');

var dbName = `habit_tracker_${process.env.NODE_ENV}`;
var userTest = require ('../db/schema/user_schema');
var activityTest = require ('../db/schema/activity_schema');
var mongoDB = `mongodb://127.0.0.1/${dbName}`;

var should = chai.should();
chai.use(chaiHTTP);

describe('Test suite: API Routes', function (){
    before(function (done){
        mongoose.connect(mongoDB, {useNewUrlParser : true});
        var db = mongoose.connection;
        var testID;
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
                testID = res.body.entry._id;
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
            .get(`/users/${testID}`)
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
                "userID": testID,
                "name": "eating",
                "frequency": "3"
            })
            .end(function(err, res){
                console.log(res.body);
                res.body.activities.should.have.lengthOf(1);
                done();
            })
        })
    })

    describe('get /activity', function(){
        it('should return an array of activity info instead of just the ID', function(done){
            chai.request(app)
            .get(`/activity?user=${testID}`)
            .end(function(err, res){
                res.body.should.have.lengthOf(1);
                res.body[0].name.should.equal('eating');
                res.body[0].frequency.should.equal(3);
                done();
            })
        });
        it('should return an array of activity info as it is incomplete', function(done){
            chai.request(app)
            .get(`/activity?user=${testID}&complete=false`)
            .end(function(err, res){
                res.body.should.have.lengthOf(1);
                res.body[0].name.should.equal('eating');
                res.body[0].frequency.should.equal(3);
                done();
            })
        });
        it('should return zero activity info as none are complete', function(done){
            chai.request(app)
            .get(`/activity?user=${testID}&complete=true`)
            .end(function(err, res){
                res.body.should.have.lengthOf(0);
                done();
            })
        });
        it('should return nothing when parameters are incorrectly inputted', function(done){
            chai.request(app)
            .get(`/activity?user=${testID}&complete=wrong`)
            .end(function(err, res){
                res.body.should.have.lengthOf(0);
                done();
            })
        });
    })
});


