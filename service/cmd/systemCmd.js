var exec = require('child_process').exec,
		os=require('os'),
		proConfig =require('../../ProConfig');

let isWin32 = os.platform() == 'win32'

exports.dir = function () {

	var cmdStr = 'git pull';
	exec(cmdStr, function(err,stdout,stderr){
	    if(err) {
	        console.log('get weather api error:'+stderr);
	    } else {

	        console.log(stdout);
	    }
	});

}


exports.update = function (version, callback) {
	console.log('proConfig.version='+ proConfig.version);
	console.log('version='+version);
	if(version != proConfig.version) {
	var cmdStr = 'git pull';
		exec(cmdStr, function(err,stdout,stderr){
	    if(err) {
	      console.log('update error:'+stderr);
	    } else {
	      console.log(stdout);
	    }
		});
	} else {
		callback(version);
	}

}
