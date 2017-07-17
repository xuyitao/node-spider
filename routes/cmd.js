var express = require('express');
var router = express.Router(),
    debug = require('debug')('node-spider:api'),
    cmd = require('../service/cmd');
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('handler cmd');
});


function makeResult(err, result, id) {
  return {result:result,
          error:err,
          id:id};
}

router.post('/cmd', function(req, res, next) {
  [id, method, params] = [req.body.id, req.body.method, req.body.params];
  // console.log('cmd req.body='+JSON.stringify(req.body));
  console.log(`cmd  method=${method}  params=${params} id=${id}`);
  if(typeof cmd[method] === 'function') {
    cmd[method](params, function (err, result) {
      console.log(`result=${result}  err=${err}`);
      res.send(makeResult(err, result, id));
    })
  } else {
    res.send(makeResult(new Error("it's not function "+"method"), null, id));
  }
});


module.exports = router;
