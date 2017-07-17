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
	if(callback) callback(null, version);
	if(version != proConfig.version) {
		let cmdStr = 'git pull';
		exec(cmdStr, function(err,stdout,stderr){
	    if(err) {
	      console.log('update error:'+stderr);
	    } else {
	      console.log(stdout);
	    }
		});
	}
}
