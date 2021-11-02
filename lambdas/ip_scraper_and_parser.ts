
import fetch from 'cross-fetch';
import { fstat } from 'fs';
import fs from 'fs';
import csv from 'csv';
import csvParse from 'csv-parse';
import { resourceLimits } from 'worker_threads';
import { variableDeclaration } from '@babel/types';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriterOne = createCsvWriter({
  path: 'ip_addresses_lvl1.csv',
  header: [
    {id: 'address', title: 'Address'},
    {id: 'level', title: 'Level'}
  ]
});

const csvWriterTwo = createCsvWriter({
  path: 'ip_addresses_lvl2.csv',
  header: [
    {id: 'address', title: 'Address'},
    {id: 'level', title: 'Level'}
  ]
});

const csvWriterThree = createCsvWriter({
  path: 'ip_addresses_lvl3.csv',
  header: [
    {id: 'address', title: 'Address'},
    {id: 'level', title: 'Level'}
  ]
});

const BaseURL = "https://api.github.com/repositories/35515847/git/trees/master?recursive=1";

async function pullFromRepo<T>(url: string): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await (response.json() as Promise<{ data: T; }>);
  let result = JSON.parse(JSON.stringify(data));
  
  return result;
}

async function chainResults(BaseURL: string) {
  let fileList = JSON.parse(JSON.stringify(await pullFromRepo(BaseURL)));
  let ipList: Set<string>;

  for (let file of fileList["tree"]) {
    if (file["path"].endsWith(".ipset") || file["path"].endsWith(".netset")) {
      let currentFile = JSON.parse(JSON.stringify(await pullFromRepo(file["url"])));
      let fileContents = Buffer.from(currentFile["content"], currentFile["encoding"]).toString('utf-8');
      let fileLevel = checkLevel(file["path"]);
      ipList = cleanFileContents(fileContents);
      await writeToCsv(ipList, fileLevel)
    }
  }

  cleanFiles('ip_addresses_lvl1.csv');
  cleanFiles('ip_addresses_lvl2.csv');
  cleanFiles('ip_addresses_lvl3.csv');
}

function checkLevel(filename: string) {
  var levelOne = ["feodo", "palevo", "sslbl", "zeus_badips", "dshield", "spamhaus_drop", "spamhaus_edrop", "bogons", "fullbogons"];
  var levelTwo = ["openbl", "blocklist_de", "zeus"];

  for (var i = 0; i < levelOne.length; i++) {
    if (filename.indexOf(levelOne[i]) > -1) {
      console.log("This is a level 1 IP Blocklist")
      return "1";
    }
  }
  for (var i = 0; i < levelTwo.length; i++) {
    if (filename.indexOf(levelTwo[i]) > -1) {
      console.log("This is a level 2 IP Blocklist")
      return "2";
    }
  }
  console.log("This is a level 3 IP Blocklist")
  return "3";
}

function cleanFileContents(fileContents: string) {
  let unparsedIpList = []

  for (let line of fileContents.split("\n")) {
    if (!(line.startsWith("#"))) {
      console.log(line);
      unparsedIpList.push(line);
    }
  return checkForDuplicateIps(unparsedIpList);
  }
}

function checkForDuplicateIps(unparsedIpList: any) {
  return new Set<string>(unparsedIpList)
}

async function writeToCsv(ipList: Set<string>, ipLevel: string ) {
  let ipsAndLevel = []

  for(let ip in ipList){
    let ipAndLevel = {address: ip, level: ipLevel};
    ipsAndLevel.push(ipAndLevel);
  }
  
  if (ipLevel == "1") {
    csvWriterOne.writeRecords(ipsAndLevel)
    pullAddressesFromCSV('ip_addresses_lvl1.csv')
  }
  if (ipLevel == "2") {
    csvWriterTwo.writeRecords(ipsAndLevel)
    pullAddressesFromCSV('ip_addresses_lvl2.csv')
  }
  if (ipLevel == "3") {
    csvWriterThree.writeRecords(ipsAndLevel)
    pullAddressesFromCSV('ip_addresses_lvl3.csv')
  }

  
}

async function pullAddressesFromCSV(csvFile: string) {
  let ipAddresses: any[] = [];
  
  return new Promise(function(resolve, reject) {
    fs.createReadStream(csvFile)
      .pipe(csvParse({delimiter: ',', columns: true}))
      .on('error', error => (error))
      .on('data', row => ipAddresses.push(row['Address']))
      .on('end', () => {
        resolve(ipAddresses);
      });
  });
}

async function cleanFiles(csvFile: string) {
  let unparsedIpList: {};
  
  unparsedIpList = await pullAddressesFromCSV(csvFile);
  let parsedIpList = checkForDuplicateIps(unparsedIpList);

  if (csvFile == 'ip_addresses_lvl1.csv') {
    fs.unlinkSync(csvFile)
    csvWriterOne.writeRecords(parsedIpList)
    pullAddressesFromCSV(csvFile)
  }
  if (csvFile == 'ip_addresses_lvl2.csv') {
    fs.unlinkSync(csvFile)
    csvWriterTwo.writeRecords(parsedIpList)
    pullAddressesFromCSV(csvFile)
  }
  if (csvFile == 'ip_addresses_lvl3.csv') {
    fs.unlinkSync(csvFile)
    csvWriterThree.writeRecords(parsedIpList)
    pullAddressesFromCSV(csvFile)
  }
}


chainResults(BaseURL);

  