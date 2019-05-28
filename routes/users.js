var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send(`You hit home page!\n`)

});

module.exports = router;