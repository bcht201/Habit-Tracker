var express = require ('express');
var router = express.Router();
var query = require('../query');

router.get('/', query.getUserActivities);
router.put('/complete/:activityID', query.completeActivity);
router.put('/edit', query.updateActivity);
router.post('/new', query.newActivity);
router.delete('/:activityID', query.deleteActivity);

module.exports = router;