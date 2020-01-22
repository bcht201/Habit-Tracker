var chai = require ('chai');
var chaiHTTP = require ('chai-http');
const expect = chai.expect;
var mongoose = require ('mongoose');
var app = require ('../app');

var dbName = 'activityTest';
var mongoDB = `mongodb://127.0.0.1/${dbName}`;
var testSchema = require('../db/schema/testActivity');

var should = chai.should();
chai.use(chaiHTTP);

describe('Test suite: API Routes', function (){
    before(function (done){
        mongoose.connect(mongoDB, {useNewUrlParser : true});
        var db = mongoose.connection;
        db.on('error', console.error.bind(console, 'MongoDB connection error:'));
        db.once('open', function (){
            console.log('Connected to test database...');
            testSchema.deleteMany({}, (err, entries)=>{
                if(err) console.log(err);
                console.log('DB resetted');
            }).then(() => done());
        });
    });
    
    after(function(done){
        mongoose.connection.db.dropDatabase(function(){
            mongoose.connection.close(done);
        })
    })

    describe('get /showActivity', function(){
        it('should return an empty db', function(done){
            chai.request(app)
            .get('/showActivity')
            .end(function(err, res){
                res.body.should.be.a('array');
                res.body.should.eql([]);
                done();
            })
        });
    });

    describe('post /newActivity', function(){
        it('should add new activity into db', function(done){
            chai.request(app)
            .post('/newActivity')
            .send({
                title: 'testing db insert'
            })
            .end(function(err, res){
                res.should.have.status(200);
                res.body.should.have.property('entry');
                res.body.entry.title.should.equal('testing db insert');
                done();
            })
        })
    })
});


