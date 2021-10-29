
import fetch from 'cross-fetch';
import 'csv-parser';
import 'fs';

const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const csvWriter = createCsvWriter({
  path: 'ip_addresses.csv',
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

  for (let file of fileList["tree"]) {
    if (file["path"].endsWith(".ipset") || file["path"].endsWith(".netset")) {
      let currentFile = JSON.parse(JSON.stringify(await pullFromRepo(file["url"])));
      let fileContents = Buffer.from(currentFile["content"], currentFile["encoding"]).toString('utf-8');
      let fileLevel = checkLevel(file["path"]);
      // Write the resulting IPs along with the fileLevel to the IP Adress CSV
      // Break this section out into a separate function to keep this one as small as possible
      // Create another function that takes the finished product and dedupes the list of IPs, making sure to keep the highest level.
    }
  }
}
function cleanFileContents(fileContents: string) {
  // Parse the file, remove any comments and check for any duplicate IPs, return comma delimited list of IPs

  console.log(fileContents)

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


chainResults(BaseURL);