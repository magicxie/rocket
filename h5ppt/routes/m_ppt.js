var express = require('express');
var router = express.Router();

/* GET m_ppt listing. */
router.get('/', function(req, res) {
  res.render('m_ppt', { title: 'H5PPT' });
});

module.exports = router;
