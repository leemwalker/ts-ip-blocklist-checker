# ts-ip-blocklist-checker

This project is built to deploy into AWS using AWS Well-Architected through the SaaS lens.

It is written in TypeScript for Lambdas and Terraform to handle the infrastructure.

It will use an API Gateway with one lambda behind it, this lambda will take an IP address, use S3 Select to search a file in a S3 bucket, and respond with a HTTP 200 code if the IP address is not in the file, a 512 if the IP address is in the file and a level 1 threat, or a 513 if the IP address is in the file and a level 2 threat.

There will be another lambda with an EventBridge trigger, this one will pull an updated IP adress list from the https://github.com/firehol/blocklist-ipsets repo, parse it for unique IP addresses and add them to a S3 bucket in .csv format.

The S3 bucket will only hold the one CSV file and will be blocked off from the outside world.
