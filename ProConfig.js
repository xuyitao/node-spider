

var debug = require('debug')('node-spider:config'),
		schedule = require('node-schedule'),
		cmd=require('./service/cmd'),
		config = require("./package.json"),
		ClientFactory = require('./service/ClientFactory');

console.log(`service process.env.DTYPE=${process.env.DTYPE}`);
var dtype = process.env.DTYPE;
exports.isService=function isService() {
	return dtype && dtype === 'client' ? false : true;;
}


exports.isClient=function isClient() {
	return dtype && dtype === 'service' ? false : true;
}

exports.version= config.version;

if(this.isService()) {
	//初始化客户端列表
	var clientFactory = new ClientFactory([{
		host:'tks32.owngiftc.com',
		port:'80'
	}
	,{
		host:'127.0.0.1',
		port:'80'
	}
	]);

	exports.getClientFactory = function getClientFactory() {
		return clientFactory;
	}

	var j = schedule.scheduleJob('*/1 * * * *', function(){
		debug('schedule service valid');
		// console.log('this.clientFactory='+getClientFactory());
		clientFactory.heart();

	});
}
