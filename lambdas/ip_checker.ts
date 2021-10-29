// This lambda will run S3 Select against the S3 bucket
// If an IP address is NOT found it will return 200.
// If an IP address is found, it will be returned as a 513 if level 1, 514 if level 2, and 515 if level 3.