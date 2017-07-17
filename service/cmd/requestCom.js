'use strict'
var _ = require('underscore')._,
	request = require('request'),
	debug = require('debug')('spider'),
	zlib = require('zlib'),
	moment = require('moment'),
	iconv = require('iconv-lite');

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

var requestUrl = exports.requestUrl = function (url) {
	console.log('requestUrl href ='+url);
	return new Promise(function(resolve,reject) {
    var options = {
        url: url,
        // proxy: "http://127.0.0.1:8888",
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 BIDUBrowser/8.0 Safari/537.36',
            'Accept-Language':'en-US,en;q=0.8',
            'Accept-Encoding':'gzip, deflate, sdch',
            'Accept': "*/*",
            'Connection':'keep-alive'
        }
    };
    requestWithEncoding(options, function(err, data, res) {
			console.log('requestUrl err='+err);
        if (err) {
          reject(err);
        } else {
					console.log('requestUrl finish');
					resolve({
						'body':data,
						'res':res
					});
        }
    });
	});
}

var requestWithEncoding = exports.requestWithEncoding = function (options, callback) {
  var req = request.get(options).on('error', function(err) {
			callback(err);
		});
  req.on('response', function(res) {
    var chunks = [];
    res.on('data', function(chunk) {
      chunks.push(chunk);
    });

    res.on('end', function() {
      var buffer = Buffer.concat(chunks);
			if(buffer.length == 0) {
				callback(null, '', res);
				return ;
			}

      var encoding = res.headers['content-encoding'];
      var charset = res.headers['content-type'];

      charset = getCharset(charset);
			charset = charset?'utf-8':charset.toLowerCase();

      var str;
      if (encoding == 'gzip') {
        zlib.gunzip(buffer, function(err, decoded) {
            if(charset.indexOf('gbk') !== -1) {
                str = iconv.decode(decoded, 'gbk');
            } else {
                str = decoded.toString();
            }
            callback(err, str, res);
        });
      } else if (encoding == 'deflate') {
        zlib.inflate(buffer, function(err, decoded) {
            if(charset.indexOf('gbk') !== -1) {
                str = iconv.decode(decoded, 'gbk');
            } else {
                str = decoded.toString();
            }
            callback(err, str, res);
        })
      } else {
          if(charset.indexOf('gbk') !== -1) {
              str = iconv.decode(buffer, 'gbk');
          } else {
              str = buffer.toString();
          }
          callback(null, str, res);
      }
    });
  });
}

function getCharset(content) {
    if(content !== undefined) {
        var strs = content.split(';');
        if(strs.length > 0) {
            for (var i = 0; i < strs.length; i++) {
                var str = strs[i];
                var index= str.indexOf('charset');
                if(index !== -1) {
                    var sets = str.split('=');
                    if(sets.length === 2) {
                        return sets[1];
                    }
                }
            }

        }
    }
    return null;
};

var timeFormat = "YYYY-MM-DD hh:mm:ss";
module.exports.formatDate = function (date) {
	return moment(date).format(timeFormat);
}

module.exports.formatMomnet = function (moment) {
	return moment.format(timeFormat);
}


var findStr=module.exports.findStr=function(str, startstr, endstr) {
    var start = str.indexOf(startstr);
    if(start === -1) {
        return null;
    }
    start += startstr.length;
    var end = str.indexOf(endstr, start);
    if(end === -1) {
        return null;
    }

    // if(debug) console.log(start + '    ' + end);
    var body = str.substring(start, end);
    // if(debug) console.log('body ' + body);
    return body;
}


var putImageHttp=module.exports.putImageHttp=function(img) {
    if(img !== undefined && img.indexOf('http') === -1) {
        img = 'https:' + img;
    }
    return img;
}
