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
		timeout:3000
	}, sClient);
}

module.exports.proxy = function proxy(url, callback) {

	let jclient = makeClient();
	jclient.cmd('proxy', url, callback);

}

module.exports.updateAll = function proxy(url, callback) {
	ClientFactory.updateAll(callback);
}
