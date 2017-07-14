

var proArgs = process.argv.splice(2);
var debug = require('debug')('node-spider:config');

var type=proArgs[0];
debug(`service type=${type}`);
exports.isService=function isService() {
	return type && type === 'client' ? false : true;;
}


exports.isClient=function isClient() {
	return type && type === 'service' ? false : true;
}
