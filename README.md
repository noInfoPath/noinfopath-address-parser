# NoInfoPath Address Parser (noinfopath-address-parser)

## Overview

Parses a new line or comma separated address into a JSON object of properties.

## Installation

```
npm install noinfopath-address-parser --save
```

## Usage

```js

	describe("Testing address parser", function(){

		it("Testing address ", function(){
			var raw = "Foo Bar (Billing Records)\1234 U.S. 287 Frontage Road\nArlington, TX 76001",
				expected = {
					"city": "Arlington",
					"state": "TX",
					"zip": "76001",
					"address1": "1234 U.S. 287 Frontage Road",
					"name1": "Foo Bar (Billing Records)"
				},
				actual = addressParser(raw);

			assert.deepEqual(actual, expected);
		});

	});




```
