// This lambda will run S3 Select against the S3 bucket
// If an IP address is NOT found it will return 200.
// If an IP address is found, it will be returned as a 513 if level 1, 514 if level 2, and 515 if level 3.

const S3 = require('aws-sdk/clients/s3');
const client = new S3({
	region: 'us-east-2'
});

let allClearCode: String = "200";

function handler(event, context) {
	// Takes an IP address from API Gateway
	// Cycles through the 3 levels of IP Addresses
	// and returns the first match.
	cycleThroughFiles(event.message.data)
}

function cycleThroughFiles(ipAddress: String) {
	// Takes an IP address from API Gateway
	// Cycles through the 3 levels of IP Addresses
	// and returns the first match.

	for(let i = 1; i < 4; i++) {
		let fileName: string = "ip_addresses_lvl" + i + ".csv"
		let resultCode = "51" + i;
		// Search for the address, using the 
		if (searchFileForIP(ipAddress, fileName) === true) {
			return resultCode;
		} else {
			return allClearCode;
		}
	}
}

function searchFileForIP(ipAddress: String, fileName: String): boolean {
	// Takes in a filename and an ip address...
	// Searches the file for the ip address 
	// using S3 Select.

	let expressionString: String = 'SELECT address FROM S3Object WHERE cast(address as int) = ' + ipAddress;

	let params = {
		Bucket: 'ipscraperparserbucket',
		Key: fileName,
		ExpressionType: 'SQL',
		Expression: expressionString,
		InputSerialization: {
			CSV: {
				FileHeaderInfo: 'USE',
				RecordDelimiter: '\n',
				FieldDelimiter: ','
			}
		},
		OutputSerialization: {
			CSV: {}
		}
	};

	S3.selectObjectContent(params, (err, data) => {
		if (err) {
			// Handle error
			return false;
		}
	
		// data.Payload is a Readable Stream
		const eventStream = data.Payload;
		
		// Read events as they are available
		eventStream.on('data', (event) => {
			if (event.Records) {
				// event.Records.Payload is a buffer containing
				// a single record, partial records, or multiple records
				process.stdout.write(event.Records.Payload.toString());
			} else if (event.Stats) {
				console.log(`Processed ${event.Stats.Details.BytesProcessed} bytes`);
			} else if (event.End) {
				console.log('SelectObjectContent completed');
			}
		});
	
		// Handle errors encountered during the API call
		eventStream.on('error', (err) => {
			switch (err.name) {
				// Check against specific error codes that need custom handling
			}
			return false;
		});
	
		eventStream.on('end', () => {
			// Finished receiving events from S3
			if (data != null) {
				return true;
			} else {
				return false;
			}
		});
	});

	return false;
}

