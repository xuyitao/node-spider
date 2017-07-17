var rpc = require('./jsonrpc')

// ===----------------------------------------------------------------------===//
// Client
// ===----------------------------------------------------------------------===//
function Client(opts, sClient) {
	this.rpc = new rpc.Client(opts);
	this.sClient = sClient;
}


// ===----------------------------------------------------------------------===//
// cmd
// ===----------------------------------------------------------------------===//
Client.prototype.cmd = function () {
	let args=[].slice.call(arguments)
	let cmd = args.shift()

	callRpc(cmd, args, this.rpc)
}

function callRpc(cmd,args, rpc) {
	let fn = args[args.length - 1]

	if(typeof fn === 'function') {
		args.pop();
	} else {
		fn = function () {}
	}

	rpc.call(cmd, args, function () {
		let args = [].slice.call(arguments)
		args.unshift(null)
		fn.apply(this, args)

	}, function (err) {
		fn(err)
	})
}

module.exports.Client = Client
