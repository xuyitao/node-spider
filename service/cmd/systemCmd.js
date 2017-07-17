var exec = require('child_process').exec,
		os=require('os');

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
