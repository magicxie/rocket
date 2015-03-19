var express = require('express');
var router = express.Router();

/* GET m_index listing. */
router.get('/', function(req, res) {
  res.render('m_index', { title: 'H5PPT' });
});

module.exports = router;
