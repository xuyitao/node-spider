
var _ = require('underscore')._;

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

function ClientFactory(clients) {
	console.log('===========ClientFactory init===========');
	this.clientTotal=_.map(clients, function (tmpClient, i) {
		if(tmpClient.host && tmpClient.port) {
			console.log(`ClientFactory add ${tmpClient.host} : ${tmpClient.port}`);
			return new ClientInfo(tmpClient.host,tmpClient.port);
		}
	});

	console.log(`ClientFactory init this.clientTotal=${this.clientTotal.length}`);
	this.clientVaild = [];
	this.info();
	console.log('===========ClientFactory init end ===========');
}

ClientFactory.prototype.info = function () {
	_.each(this.clientTotal, function (tmpclient) {
		tmpclient.info();
	})

}

module.exports = ClientFactory;
