var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  req.app.locals.db.collection("saveColors").find().toArray()
  .then(results => {
    res.json(results);
  })
  res.render('index', { title: 'Express' });
});

module.exports = router;
