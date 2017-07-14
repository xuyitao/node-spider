var rpc = require('./jsonrpc')

function makeClient() {
	return new rpc.Client({
		host:'localhost',
		port:3000,
		path:'/api/cmd',
		user:'qq123',
		pass:'123',
		timeout:3000
	});
}

function proxy(url, callback) {

	let jclient = makeClient();
	jclient.cmd('proxy', url, callback);

}


module.exports.proxy = proxy;
