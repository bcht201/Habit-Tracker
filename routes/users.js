var express = require ('express');
var router = express.Router();
var query = require('../query');

router.get('/', query.getAllUsers);
router.get('/:ID', query.getSpecificUser);
router.post('/addUser', query.addUser);

module.exports = router;