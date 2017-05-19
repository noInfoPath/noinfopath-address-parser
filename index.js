function newLineParseCityStateZip(glo, parsedAddress) {

	var cityStateZip = parsedAddress[parsedAddress.length - 1].trim().split(',');
	if (cityStateZip.length == 2) {
		glo.record.city = cityStateZip[0];
		var temp = cityStateZip[1].trim().split(' ');
		glo.record.state = temp[0].substr(0, 2);
		glo.record.zip = temp[1];
	} else {
		glo.record.city = cityStateZip[0].replace(',', '');
		glo.record.state = cityStateZip[1].substr(0, 2);
		glo.record.zip = cityStateZip[2];
	}
	glo.completedLines++;
}

function newLineParseAddress(glo, parsedAddress) {
	var rawAddress = parsedAddress[parsedAddress.length - 2].trim().split(',');
	if (rawAddress.length == 1) {
		glo.record.address1 = rawAddress[0].trim();
	} else {
		glo.record.address1 = rawAddress[0].trim();
		glo.record.address2 = rawAddress[1].trim();
	}
	glo.completedLines++;
}

function newLineParseName(glo, parsedAddress) {
	var remainingLength = parsedAddress.length - glo.completedLines;
	switch (remainingLength) {
	case 0:
		break;
	case 1:
		glo.record.name1 = parsedAddress[0].trim();
		break;
	case 2:
		glo.record.name1 = parsedAddress[0].trim();
		glo.record.name2 = parsedAddress[1].trim();
		break;
	default:
		break;
	}
}

function commaParseStateZip(glo, parsedAddress) {
	var stateZip = parsedAddress[parsedAddress.length - 1].trim().split(' ');

	glo.record.state = stateZip[0].substr(0, 2);
	glo.record.zip = stateZip[1];

	glo.completedLines++;
}

function commaParseCity(glo, parsedAddress) {
	glo.record.city = parsedAddress[parsedAddress.length - 2].trim();
	glo.completedLines++;
}

function commaParseAddress(glo, parsedAddress) {
	for (var l = 0; l <= parsedAddress.length - 2; l++) {
		var line = parsedAddress[l].trim();
		if (!isNumber(line.substr(0, 1))) continue;
		var remaining = (parsedAddress.length - 2) - (l + 1);
		// If there is any remaining, there is another line before we get to city/state/zip and need to put that line as address2
		if (remaining === 0) {
			glo.record.address1 = line;
			glo.completedLines = glo.completedLines + 1;
		} else {
			glo.record.address1 = line;
			glo.record.address2 = parsedAddress[l + 1].trim();
			glo.completedLines = glo.completedLines + 2;
		}
		break;
	}
}

function commaParseName(glo, parsedAddress) {
	glo.remainingLines = parsedAddress.length - glo.completedLines;
	switch (glo.remainingLines) {
	case 0:
		break;
	case 1:
		glo.record.name1 = parsedAddress[0].trim();
		break;
	default:
		glo.record.name1 = parsedAddress[0].trim();
		// treat all remaining lines as name2, so join remaining lines together separated by ','
		var name2Array = [];
		for (var rem = 1; rem < glo.remainingLines; rem++) {
			name2Array.push(parsedAddress[rem].trim());
		}
		glo.record.name2 = name2Array.join(", ");
		break;
	}
	// if (remainingLines === 1){
	// 	record.name1 = parsedAddress[0].trim();
	// } else {
	// 	record.name1 = parsedAddress[0].trim();
	// 	// treat all remaining lines as name2, so join remaining lines together separated by ','
	// 	var name2Array = [];
	// 	for(var rem = 1; rem < remainingLines; rem++){
	// 		name2Array.push(parsedAddress[rem].trim());
	// 	}
	// 	record.name2 = name2Array.join(", ");
	// }
}

function isNumber(i) {
	return !Number.isNaN(Number(i)) && i !== null;
}

function parse(input) {
	try {
		var glo = {},
			parsedAddress = input.trim().split('\n');

		glo.completedLines = 0;
		glo.record = {};

		// Test to see if the input is a new line separated address, if the length is < 2 assume it's a comma separated address.
		if (parsedAddress.length < 2) {
			// Comma separated address
			parsedAddress = parsedAddress[0].trim().split(',');
			// Test to see if input is < 2, if not, assume invalid input and return.
			if (parsedAddress.length < 2) {
				return;
			}
			// Test to see if the first line starts with a number, if so, assume no name.
			if (isNumber(parsedAddress[0].trim().substr(0, 1))) {
				commaParseStateZip(glo, parsedAddress);
				commaParseCity(glo, parsedAddress);
				commaParseAddress(glo, parsedAddress);
			} else {
				commaParseStateZip(glo, parsedAddress);
				commaParseCity(glo, parsedAddress);
				commaParseAddress(glo, parsedAddress);
				commaParseName(glo, parsedAddress);
			}
		} else {
			// New Line separated address
			// Test to see if the first line starts with a number, if so, assume no name.
			if (isNumber(parsedAddress[0].trim().substr(0, 1))) {
				newLineParseCityStateZip(glo, parsedAddress);
				newLineParseAddress(glo, parsedAddress);
			} else {
				newLineParseCityStateZip(glo, parsedAddress);
				newLineParseAddress(glo, parsedAddress);
				newLineParseName(glo, parsedAddress);
			}
		}
		return glo.record;
	} catch (err) {
		console.error(err);
	}
}

module.exports = parse;
