var sprider = require('./requestCom');
var _ = require('underscore')._;
var moment = require('moment');
var request = require('request');
var async = require('async');
var cheerio = require('cheerio');

module.exports.spider = function (url, callback) {
    console.log('get1688Ojbect spider url='+url);
    var promise = getUrl(url);
    promise.then(function (targetUrl) {
      console.log('1688  targetUrl='+targetUrl);
      return get1688Request(targetUrl);
    }).then(function (result) {
      callback(null, result);
    }).catch(function(err){
      callback(err);
    })

    // get1688Model('https://img.alicdn.com/tfscom/TB13B.JOFXXXXcMXVXXXXXXXXXX');
}

function getUrl(url) {
  console.log('getUrl  url='+url);
    return new Promise(function(resolve,reject) {
        if(url.indexOf('https://trade.1688.com/order') !== -1
            || url.indexOf('http://trade.1688.com/order') !== -1) {
            var options = {
                url: url,
                // proxy: "http://127.0.0.1:8888",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
                    'Accept-Language':'zh-CN,zh;q=0.8',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept': "*/*",
                    'Connection':'keep-alive'
                }
            };

            sprider.requestWithEncoding(options, function(err, data, charset) {
                if (err) {
                    reject(err);
                } else {
                    $ = cheerio.load(data, {decodeEntities: false});
                    var href = $('a.button-large').attr('href');
                    console.log('href='+href);
                    resolve(href);
                }
            });
        } else if(url.indexOf('https://qr.1688.com/share.html') !== -1) {
            console.log('getUrl  qr.1688.com');
            var options = {
                url: url,
                // proxy: "http://127.0.0.1:8888",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
                    'Accept-Language':'zh-CN,zh;q=0.8',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept': "*/*",
                    'Connection':'keep-alive'
                }
            };

            sprider.requestWithEncoding(options, function(err, data, charset) {
                if (err) {
                    reject(err);
                } else {
                  var id = sprider.findStr(data, 'offer?id=','.html');
                  if(!id) {
                    id = sprider.findStr(data, 'offerId=','&');
                  }
                  console.log('id='+id);
                  resolve('https://detail.1688.com/offer/'+ id +'.html');
                }
            });
        } else if(url.indexOf('http://ma.m.1688.com/rush.html') !== -1) {
            console.log('getUrl  qr.1688.com');
            var options = {
                url: url,
                // proxy: "http://127.0.0.1:8888",
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
                    'Accept-Language':'zh-CN,zh;q=0.8',
                    'Accept-Encoding':'gzip, deflate, sdch',
                    'Accept': "*/*",
                    'Connection':'keep-alive'
                }
            };

            sprider.requestWithEncoding(options, function(err, data, charset) {
                if (err) {
                    reject(err);
                } else {
                  var shareurl = sprider.findStr(data, 'androidWapUrl=\"','\"');
                  console.log('shareurl='+shareurl);
                  getUrl(shareurl).then(function (url) {
                    resolve(url);
                  }).catch(function (err) {
                    reject(reject);
                  });
                }
            });
        }else {
            resolve(url);
        }
    });
}



function get1688Request(targetUrl) {
    return new Promise(function(resolve,reject) {
    var options = {
        url: targetUrl,
        // proxy: "http://127.0.0.1:8888",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept': "*/*",
            'Connection':'keep-alive',
            maxRedirects:3
            // 'Referer':'https://detail.tmall.com/item.htm?id='+id
        }
    };
    sprider.requestWithEncoding(options, function(err, data, charset) {
        if (err) {
            reject(err);
        } else {
            // console.log("data="+data);
            try {
              $ = cheerio.load(data, {decodeEntities: false});
              var title = $('h1.d-title').html().trim();
              let defaultPrice;
              $('.unlogin-daixiao > div.row1 > span.value').each(function (i, elem) {
                  defaultPrice = $(elem).text().trim();
              });

              var shopname = $('div.company-name').html().trim();
              var imgs = [];
              $('ul.nav-tabs > li.tab-trigger').each(function(i, elem) {
                 var imgStr = $(elem).attr("data-imgs");
                 var img = JSON.parse(imgStr).preview;

                 if (img.indexOf('https:') === -1) {
                     img = 'https:' + img;
                 }

                 if(imgs.length < 5) {
                     imgs[i] = img;
                 }
              });

              var config = sprider.findStr(data, "iDetailConfig = ","};")+'}';
              var pageid = sprider.findStr(config, "'pageid':'","',");
              var offerid =sprider.findStr(config, "'offerid':'","',");
              var memberid = sprider.findStr(config, "'memberid':'","',");
              var beginAmount =  sprider.findStr(config, "'beginAmount':'","',");
              if(!defaultPrice) {
                  defaultPrice = sprider.findStr(config, "'refPrice':'","',");
              }
              var currentTime = sprider.findStr(config, "'currentTime':'","',");

              var DDataStr = sprider.findStr(data, "iDetailData = ","};")+'}';
              DDataStr = DDataStr.replace(/'/g, '"');
              var DData = JSON.parse(DDataStr);
              var skuName = [];
              var skuList = [];
              var priceRange;
              if(DData.sku !== null && DData.sku !== undefined) {
                  var skuNameT = DData.sku.skuProps;
                  skuNameT.map(function (itemT) {
                      var valuesTs = itemT.value;
                      var values=[];
                      valuesTs.map(function (valuesT) {
                          value = {
                              'id':valuesT.name,
                              'text':valuesT.name
                          };

                          var img = valuesT.imageUrl;
                          if(img !== undefined) {
                              value['img'] = sprider.putImageHttp(img);
                          }

                          values.push(value);
                      });
                      skuName.push({
                          'id':itemT.prop,
                          'text':itemT.prop,
                          'values':values
                      });
                  });

                  var skuListT = DData.sku.skuMap;
                  for (var listI in skuListT) {
                     var itemT = skuListT[listI];

                     var sku = {
                         'skuId':itemT.skuId,
                         'propId':listI,
                         'quantity':itemT.canBookCount
                     };

                     if(itemT.discountPrice !== null && itemT.discountPrice !== undefined) {
                         sku['price'] = itemT.discountPrice;
                     } else if(itemT.price !== null && itemT.price !== undefined) {
                         sku['price'] = itemT.price;
                     }
                     skuList.push(sku);
                  }
                  priceRange = DData.sku.priceRange;
              }
              //总库存
              var dataconfig = $('.mod-detail-purchasing').attr("data-mod-config");
              var maxQ = sprider.findStr(data, 'max":"','"');
              var sku = {
                  'skuId':0,
                  'propId':0,
                  'quantity': maxQ,
                  'price':0
              };
              skuList.push(sku);

              if(priceRange === null || priceRange === undefined) {
                  priceRange = [];
                  $('tr.price > td').each(function(i, elem) {
                      console.log("i="+i);
                      if(i !== 0) {
                          var rangeStr = $(elem).attr("data-range");
                          if(rangeStr !== undefined) {
                              var rangeJson = JSON.parse(rangeStr);
                              var temp = [];
                              temp[0] = rangeJson.begin;
                              temp[1] = rangeJson.price;
                              priceRange.push(temp);
                          }
                      }
                  });
              }
              let dataUrl= $('#desc-lazyload-container').attr('data-tfs-url');
              get1688Model(dataUrl, {
                  'imgs':imgs,
                  'shopname':shopname,
                  'title':title,
                  'pageid':pageid,
                  'offerid':offerid,
                  'memberid':memberid,
                  'beginAmount':beginAmount,
                  'defaultItemPrice':defaultPrice,
                  'currentTime':currentTime,
                  // 'sellerId':sellerId,
                  'priceRange':priceRange,
                  'skuName':skuName,
                  'skuList':skuList,
                  'url':targetUrl
              }, function (err, result) {
                  if(err) {
                      reject(err);
                  } else {
                      resolve(result);
                  }
              });
            }catch(err) {
              reject(err);
            }
        }
    });
    });
}

function get1688Model(url, result, callback) {
    console.log('get1688Model url='+url);
    var options = {
        url: url,
        // proxy: "http://127.0.0.1:8888",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept': "*/*",
            'Connection':'keep-alive'
        }
    };

    sprider.requestWithEncoding(options, function(err, data, charset) {
        if (err) {
            callback(null, result);
        } else {
            let contentData = findContent(data);
            let content = null;
            if(contentData == null) {
                content = findContentEx(data);
            } else {
                let jsonc = JSON.parse(contentData);
                content = jsonc.content;
            }
            // console.log("content="+content);
            if(content != null) {
              let $ = cheerio.load(content, {decodeEntities: false});
              let imgs = [];
              $('img').each(function(i, elem) {
                let img = $(elem).attr('src');
                if(img) {
                    if(img.indexOf("https:") == -1) {
                        img="https:"+img;
                    }
                    imgs.push(img);
                }
              });
              result['models']=imgs;
            }
            callback(null, result);
        }
    });
}


function findContent(str) {
  let startstr = 'offer_details=';
  let start = str.indexOf(startstr);
  if(start === -1) {
      return null;
  }
  start += startstr.length;
  let body = str.substring(start, str.length-1);
  return body;
}

function findContentEx(str){
  let startstr = "desc='";
  let start = str.indexOf(startstr);
  if(start === -1) {
      return null;
  }
  start += startstr.length;
  let body = str.substring(start, str.length-3);
  return body;
}

function get1688TemplateId(offerId, pageId, result, callback) {
    var options = {
        url: "https://laputa.1688.com/offer/ajax/widgetList.do?callback=jQuery172038369154930114746_1469586884776&blocks=&data=offerdetail_ditto_title%2Cofferdetail_common_report%2Cofferdetail_ditto_serviceDesc%2Cofferdetail_ditto_preferential%2Cofferdetail_ditto_postage%2Cofferdetail_ditto_offerSatisfaction%2Cofferdetail_w1190_guarantee%2Cofferdetail_w1190_tradeWay%2Cofferdetail_w1190_samplePromotion&offerId="+offerId+"&pageId="+pageId,
        // proxy: "http://127.0.0.1:8888",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
            'Accept-Language':'zh-CN,zh;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept': "*/*",
            'Connection':'keep-alive'
        }
    };

    sprider.requestWithEncoding(options, function(err, data, charset) {
        if (err) {
            callback(null, result);
        } else {
            var templateId = sprider.findStr(data, 'freightTemplateId":', ",");
            console.log("templateId="+templateId);
            if(templateId !== null) {
                templateId = templateId.replace(new RegExp('"',"gm"),'');
                var deliveryFee = sprider.findStr(data, 'deliveryFee":', ",");
                deliveryFee = deliveryFee.replace(new RegExp('"',"gm"),'');
                var unitWeight = sprider.findStr(data, 'unitWeight":', "}");
                unitWeight = unitWeight.replace(new RegExp('"',"gm"),'');
                result['templateId'] = templateId;
                result['deliveryFee'] = deliveryFee;
                result['unitWeight'] = unitWeight;
            }
            callback(null, result);
        }
    });
}
