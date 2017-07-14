var http = require('http')
// var https= require('https')
var Client = function (opts) {
	this.opts = opts;
	this.http = this.opts.ssl ? https: http;
}


Client.prototype.call=function (method, params, callback, errback) {
	let time = new Date();
	let requestJson;

	//封装rpcjson 参数
	if(Array.isArray(method)) {//多个命令
		requestJson = [];
		method.forEach(function (batchCall, i) {
			//jsonrpc params {id, method, params}
			requestJson.push({
				id:time+'-'+i,
				method:batchCall.method,
				params:batchCall.params
			})
		})

	} else {//单个命令
		requestJson = {
			id:time,
			method:method,
			params:params
		}
	}
	requestJson = JSON.stringify(requestJson);

	//http请求参数
	let requestOptions = {
		host:this.opts.host || 'localhost',
		port:this.opts.port || 8332,
		path:this.opts.path || '/',
		// host:'127.0.0.1',
		// port:8888,
		// path:'http://localhost:3000/api/cmd',
		method:'POST',
		headers:{
			'Host':this.opts.host || 'localhost',
			"Content-Type": 'application/json',
			'Content-Length':requestJson.length
		},
		agent:false,
		rejectUnauthorized:this.opts.ssl && this.opts.sslStrict !== false
	}

	if(this.opts.ssl && this.opts.sslCa) {
		requestOptions.ca = this.opts.sslCa
	}

	//http 用户密码设置
	if(this.opts.user && this.opts.pass) {
		requestOptions.auth=this.opts.user+':'+this.opts.pass;
	}

	//发送请求
	let cbCalled = false;
	let request=this.http.request(requestOptions)

	//超时控制
	let reqTimeout = setTimeout(function () {
		if(cbCalled) return ;
		cbCalled = true;
		request.abort();
		let err = new Error('ETIMEDOUT')
		err.code = 'ETIMEDOUT'
		errback(err)
	}, this.opts.timeout || 30000)

	request.setTimeout(this.opts.timeout || 30000, function () {
			if(cbCalled) return ;
			cbCalled = true;
			request.abort();
			let err = new Error('ESOCKETTIMEDOUT')
			err.code = 'ESOCKETTIMEDOUT'
			errback(err)
	})

	request.on('error', function (err) {
    if (cbCalled) return
    cbCalled = true
    clearTimeout(reqTimeout)
    errback(err)
  })

	//返回结果
	request.on('response', function (response) {
		clearTimeout(reqTimeout)

		//数据填充buffer
		let buffer=''
		response.on('data', function (chunk) {
			buffer = buffer+chunk;
		})

		//响应结束，得到一个结果或正确或错误，解码json，返回结果
		response.on('end', function () {
			let err;

			if(cbCalled) return ;
			cbCalled = true;
			try {
				console.log('buffer='+buffer);
				var decode = JSON.parse(buffer)
				console.log('decode='+JSON.stringify(decode));
			} catch(e) {
				//http非正常请求
				if(response.statusCode !== 200) {
					err = new Error('Invalid params, response status code: '+ response.statusCode)
					err.code = -32602
					errback(err)
				} else {
					err = new Error('Problem parseing JSON response from server')
					err.code = -32603
					errback(err)
				}
				return ;
			}

			//如果是单返回值
			if(!Array.isArray(decode)) {
				decode = [decode]
			}

			decode.forEach(function (decodedResponse, i) {
				if(decodedResponse.hasOwnProperty('error') && decodedResponse.error!= null) {
					if(errback) {
						console.log(decodedResponse.error);
						err = new Error(decodedResponse.error.message || '')
						if(decodedResponse.error.code) {
							err.code = decodedResponse.error.code
						}
						errback(err)
					}
				} else if(decodedResponse.hasOwnProperty('result')) {
					if(callback) {
						callback(decodedResponse.result, response.headers);
					}
				} else {
					if(errback) {
						err = new Error(decodedResponse.error.message || '')
					  if (decodedResponse.error.code) {
						  err.code = decodedResponse.error.code
					  }
					  errback(err)
					}
				}
			})
		})
	})
	request.end(requestJson)
}

module.exports.Client = Client;
