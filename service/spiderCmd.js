var request = require('./requestCom');


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
