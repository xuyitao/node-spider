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
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
	})
});

router.get('/updateall', function(req, res, next) {
  console.log(`updateall`);
  sClient.updateAll(function (err, result, resHeaders) {
    console.log(err);
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
	})
});

/***
	抓取1物品优惠劵页面信息
***/
// http://localhost:3000/api/itemDetail?url=https://uland.taobao.com/coupon/elist?spm=a219t.7664554.1998457203.139.pYP65D&e=2PXSY3Jh14g3KFlMBsvUeA%3D%3D
router.get('/itemDetail', function(req, res, next) {
  var url = req.query.url;
  console.log(`itemDetail  url=${url}`);
  sClient.itemDetail(url, function (err, result, resHeaders) {
    console.log(err);
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })

});


/***
	抓取1688页面物品信息
***/
// http://localhost:3000/api/s1688?url=https://detail.1688.com/offer/554408061619.html?spm=a2604.8117111.ix8ra8z9.3.wKtELE
router.get('/s1688', function(req, res, next) {
  var url = req.query.url;
  console.log(`s1688  url=${url}`);
  sClient.s1688(url, function (err, result, resHeaders) {
    console.log(err);
    if(err) {
      res.send(err);
    } else {
      res.send(result);
    }
  })
});

module.exports = router;
