var rpc = require('./jsonrpc'),
		ClientFactory = require('../ProConfig').getClientFactory();


function makeClient() {
	let sClient = ClientFactory.getsClient();
	if(sClient==null || !sClient.host || !sClient.port) {
		return null;
	}

	return new rpc.Client({
		host:sClient.host,
		port:sClient.port,
		path:'/api/cmd',
		user:'qq123',
		pass:'123',
		timeout:15000
	}, sClient);
}

module.exports.proxy = function proxy(url, callback) {

	let jclient = makeClient();
	jclient.cmd('proxy', url, callback);

}

module.exports.itemDetail = function itemDetail(url, callback) {
	let jclient = makeClient();
	jclient.cmd('itemDetail', url, callback);
}

module.exports.s1688 = function s1688(url, callback) {
	let jclient = makeClient();
	jclient.cmd('s1688', url, callback);
}

module.exports.updateAll = function updateAll(callback) {
	ClientFactory.updateAll(callback);
}
