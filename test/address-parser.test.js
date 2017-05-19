var addressParser = require("../src/address-parser"),
	addresses = require("./fixtures/address-parser.fixture"),
	assert = require("assert");

describe("Testing address parser", function(){

	function test(d){
		var test = addresses[d],
			raw = test.raw,
			expected = test.expected,
			actual = addressParser(raw);

		assert.equal(actual, expected);
	}

	for(var d = 0; d < addresses.length; d++){
		it("Testing address " + d, test.bind(this, d));
	}
});
