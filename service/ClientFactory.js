
var _ = require('underscore')._,
		rpc = require('./jsonrpc'),
		proConfig = require('../ProConfig');

function ClientInfo(host, port) {
	this.host = host;
	this.port = port;
	this.lastTime = new Date();
	this.handlerCount=0;
	this.failCount=0;
}

ClientInfo.prototype.info = function () {
	console.log(`host=${this.host}:${this.port}  lastTime=${this.lastTime}
		handlerCount=${this.handlerCount}  failCount=${this.failCount}`);
}

ClientInfo.prototype.name = function () {
	return `${this.host}:${this.port}`
}

function ClientFactory(clients) {
	console.log('===========ClientFactory init===========');
	this.clientTotal=_.map(clients, function (tmpClient, i) {
		if(tmpClient.host && tmpClient.port) {
			console.log(`ClientFactory add ${tmpClient.host} : ${tmpClient.port}`);
			return new ClientInfo(tmpClient.host,tmpClient.port);
		}
	});

	this.clientVaild = [];
	this.info();
	console.log('===========ClientFactory init finish ===========');

	this.heart();
}

function info() {
	console.log('=====total client ');
	_.each(this.clientTotal, function (tmpclient) {
		tmpclient.info();
	})
	console.log('=====valid client ');
	_.each(this.clientVaild, function (tmpclient) {
		tmpclient.info();
	})
}

ClientFactory.prototype.info = info;

ClientFactory.prototype.getsClient = function () {
	let sClient = _.min(this.clientVaild, function(client){ return client.lastTime; });
	// sClient.info();
	sClient.lastTime = new Date();
	sClient.handlerCount += 1;
	return sClient;

}



function makeClient(host, port) {
	return new rpc.Client({
		host:host,
		port:port,
		path:'/api/cmd',
		user:'qq123',
		pass:'123',
		timeout:3000
	});
}

ClientFactory.prototype.heart = function () {
	let clientTotal = this.clientTotal;
	console.log('===========ClientFactory heart ===========');
	let promises = _.map(clientTotal, function (tmpclient) {
		return new Promise(function (resolve,reject) {
			let client = makeClient(tmpclient.host, tmpclient.port)
			client.cmd('heart', function (err, result) {
				if(err) {
					console.log(err);
					resolve(false)
				} else {
					resolve(true)
				}
			})
		})
	})
	Promise.all(promises).then(function (results) {
		console.log('results='+results);
		let tmpVailds = [];
		_.each(results, function (result, i) {
			let client = clientTotal[i];
			// client.info();
			if(result) {
				console.log(`${client.name()}---------valid`);
				tmpVailds.push(client);
			} else {
				console.log(`${client.name()}---------invalid`);
			}

		})

		this.clientVaild=tmpVailds;
		// this.info()
		console.log('===========ClientFactory heart finish===========');
	}.bind(this)).catch(function (err) {
		console.log(err);
		console.log('===========ClientFactory heart finish===========');
	})
}

ClientFactory.prototype.updateAll = function (callback) {
	let clientVaild = this.clientVaild;
	console.log('===========ClientFactory updateAll ===========');
	let promises = _.map(clientVaild, function (tmpclient) {
		return new Promise(function (resolve,reject) {
			let client = makeClient(tmpclient.host, tmpclient.port)
			client.cmd('update', proConfig.version, function (err, result) {
				console.log('result='+result);
				if(err) {
					resolve(false)
				} else {
					resolve(result)
				}
			})
		})
	})
	Promise.all(promises).then(function (results) {
		console.log('results='+results);
		_.each(results, function (result, i) {
			let client = clientVaild[i];
			// client.info();
			console.log(`${client.name()}---------update result=`+result);
		})
		if(callback) callback(true);
		console.log('===========ClientFactory updateAll finish===========');
	}).catch(function (err) {
		console.log(err);
		console.log('===========ClientFactory updateAll finish===========');
	})
}


module.exports = ClientFactory;
