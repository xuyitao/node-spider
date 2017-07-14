

var proArgs = process.argv.splice(2);
var debug = require('debug')('node-spider:config'),
		ClientFactory = require('./service/ClientFactory');

var type=proArgs[0];
debug(`service type=${type}`);
exports.isService=function isService() {
	return type && type === 'client' ? false : true;;
}


exports.isClient=function isClient() {
	return type && type === 'service' ? false : true;
}


//初始化客户端列表
let clientFactory = new ClientFactory([{
	host:'127.0.0.1',
	port:'3000'
},{
	host:'127.0.0.1',
	port:'3000'
}
]);

exports.getClientFactory = function getClientFactory() {
	return clientFactory;
}
