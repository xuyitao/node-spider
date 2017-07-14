var assert = require("assert");
var rpcClient = require("../service/jsonrpc")

describe('rpcClient', function () {
	describe('toString()', function () {
		it('create rpcClient and tostring', function () {
			let client = new rpcClient(1);

			assert.equal(-1, client.toString())
		})
	})
})
