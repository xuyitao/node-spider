var express = require('express');
var router = express.Router(),
    sClient = require('../service/spiderClient');
    debug = require('debug')('node-spider:api');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('request with method with params');
});

router.get('/proxy', function(req, res, next) {
  let url = req.query.url;
  console.log(`proxy  url=${url}`);
  sClient.proxy(url ,function (err, result, resHeaders) {
    console.log(err);
    console.log(result);
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
	})
});


module.exports = router;
