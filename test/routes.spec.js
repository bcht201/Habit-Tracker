process.env.NODE_ENV = 'test';
var chai = require ('chai');
var chaiHTTP = require ('chai-http');
const expect = chai.expect;
var mongoose = require ('mongoose');
var app = require ('../app');

var dbName = 'activityTest';
var userTest = require (`../db/schema/user_schema_${process.env.NODE_ENV}`);
var activityTest = require (`../db/schema/activity_schema_${process.env.NODE_ENV}`);
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

    describe('post /newUser', function(){
        it('should add new user into users collection in DB', function(done){
            chai.request(app)
            .post('/newUser')
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

    describe('get /showAllUsers', function(){
        it('should return 1 user', function(done){
            chai.request(app)
            .get('/showAllUsers')
            .end(function(err, res){
                res.body.should.be.a('array');
                res.body.should.have.lengthOf(1);
                done();
            })
        });
    });

    describe('post /newActivity', function(){
        it('should add new activity into db', function(done){
            chai.request(app)
            .post('/newActivity')
            .send({
                "userID": testID,
                "name": "eating",
                "frequency": "3",
                "timeframe": "daily"
            })
            .end(function(err, res){
                res.body.activities.should.have.lengthOf(1);
                done();
            })
        })
    })

    describe('get /habits/:id', function(){
        it('should return an array of activity info instead of just the ID', function(done){
            chai.request(app)
            .get(`/habits/${testID}`)
            .end(function(err, res){
                res.body.activities.should.have.lengthOf(1);
                res.body.activities[0].name.should.equal('eating');
                res.body.activities[0].frequency.should.equal(3);
                done();
            })
        })
    })
});


