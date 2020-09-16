var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  //res.render('index', { title: 'Express' });
  res.send(__dirname + "/index.html");
});

module.exports = router;
