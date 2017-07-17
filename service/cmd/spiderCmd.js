var request = require('./requestCom'),
		s1688 = require('./spider1688');


exports.heart=function (params, callback) {
	callback(null, true);
}

exports.proxy=function (params, callback) {
	let url = params[0];
	console.log(`proxy  url=${url}`);
	return request.requestUrl(url).then(function (data) {
		console.log('data.body='+data.body.length);
		if(callback && data.body) callback(null, data.body);
	}).catch(function (err) {
		if(callback) callback(err);
	})
}


exports.proxy=function (params, callback) {
	let url = params[0];
	console.log(`proxy  url=${url}`);
	return request.requestUrl(url).then(function (data) {
		console.log('data.body='+data.body.length);
		if(callback && data.body) callback(null, data.body);
	}).catch(function (err) {
		if(callback) callback(err);
	})
}


function parseCookies(request) {
    var list = {},
        rc = request.headers['set-cookie'].toString();
    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}
/***
	获取物品信息
***/
exports.itemDetail = function (params, callback) {
	let url = params[0];
	console.log(`itemDetail  url=${url}`);
	request.requestUrl(url).then(function (json) {
		var cookie = parseCookies(json.res);
		var params = url.replace('http://uland.taobao.com/coupon/edetail?','');
		params = params.replace('https://uland.taobao.com/coupon/edetail?','');
		var redirct_url = 'https://uland.taobao.com/cp/coupon?ctoken='+cookie.ctoken+'&'+params;
		return request.requestUrl(redirct_url);
	}).then(function (json) {
		var body = JSON.parse(json.body);
		callback(null, body);
	}).catch(function (err) {
		callback(err);
		debug('getCateTotal err='+err);
	});

}



/***
	抓取1688页面物品信息
***/
exports.s1688 = function (params, callback) {
	let url = params[0];
	console.log(`s1688  url=${url}`);
	s1688.spider(url, function (err, result) {
		if(callback) callback(err, result);
	});

}
