var request = require('./requestCom');


exports.proxy=function (url, callback) {
	console.log(`proxy  url=${url}`);
	return request.requestUrl(url).then(function (data) {
		console.log('data.body='+data.body);
		if(callback && data.result) callback(null, data.result);
	}).catch(function (err) {
		if(callback) callback(err);
	})
}
