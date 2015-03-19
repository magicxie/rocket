var express = require('express');
var router = express.Router();

/* GET ppt listing. */
router.get('/', function(req, res) {
  res.render('ppt', { title: 'H5PPT' });
});

module.exports = router;
