var express = require ('express');
var router = express.Router();
var query = require('../query');

router.get('/', query.getUserActivities);
router.put('/complete/:activityID', query.completeActivity);
router.post('/new', query.newActivity);

module.exports = router;