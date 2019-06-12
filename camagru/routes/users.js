var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  //res.send('respond with a resource');
  res.json([{
	  id: 1,
	  username: "sam"
  }, {
	  id: 2,
	  username: "max"
  }, {
	  id: 3,
	  username: "liz"
	}]);
});

module.exports = router;
