import fetch from 'node-fetch';

import * as fs from 'fs';

//https://api.solscan.io/account/transaction?address=5FzddvKbxE54KEg2WoeNiGWJYAUBabKVFg2MVCSacWiJ
//ttps://api.solscan.io/transaction?tx=3Fmr4Rw9BLyyMhsvQw8nJvaQ36qw7w6p9nbiwypnoyZTDwAfYTNWdE9Qix7FtkWBda3BjB5JJ3cUo8yR4oxJopbQ
//https://api.solscan.io/account?address=2KDwGzcoPVRLwxnvLZkNtpmxeLaoFLXFLw7HUvHs5oJB
//https://api.solscan.io/account?address=HSiz3BbyWCZy5wA8mxeNH6hfjMWiAqNLg17UuVix8Xr8


let rawdata = fs.readFileSync('result.json');
let result = JSON.parse(rawdata);

var response;
var jsonresp;
var obj;

var alltxn = []; var alltxnTime = [];
const delay = ms => new Promise(res => setTimeout(res, ms));

	var discCnt = 0;
	for(var i=0; i<result.length;i++){
		if(result[i].discord == "true" ){
			discCnt++;	
		}
	}

console.log("Started again .... DISCORD SYNC "+discCnt+" / "+result.length)
await delay(5000);
console.log("Started again ....")

response = await fetch('https://api.solscan.io/account/transaction?address=5FzddvKbxE54KEg2WoeNiGWJYAUBabKVFg2MVCSacWiJ');
await delay(1000);
jsonresp = await response.text();
obj = JSON. parse(jsonresp);

//console.log("LATEST "+ obj.data[0].txHash);

var latestTx = obj.data[0].txHash;

for(var i=0; i < obj.data.length; i++){
		alltxn.push(obj.data[i].txHash); alltxnTime.push(obj.data[i].blockTime);
}

//console.log(alltxn);
for(var x=0; x < alltxn.length; x++){
	await process(alltxn[x],alltxnTime[x]);
}


async function process(txnId, blockTime) {
			
		latestTx = txnId
		console.log("Proessing "+txnId)
		
		var myDate = new Date(blockTime*1000);
		myDate = myDate.toISOString().replace("Z"," ").replace("T"," ");

		//check result already has the data
		for(var i=0; i<result.length;i++){
			if(result[i].txn==txnId){
				console.log("#####   Already processed "+txnId)
				return;
			}
		}

		response = await fetch('https://api.solscan.io/transaction?tx='+latestTx);
		await delay(1000);
		jsonresp = await response.text();
		obj = JSON. parse(jsonresp);

		if(obj==undefined || obj == null || obj.inputAccount==undefined && Array.isArray(obj.inputAccount) ){
			return;
		}
		var latestAcc = obj.inputAccount[1].account; //console.log(latestAcc)

		//console.log(Json.stringify(obj));


		if(obj.innerInstructions[0] == undefined || obj.innerInstructions[0].parsedInstructions == undefined ){
			result.push({ "name" : "" , "price" : "", "address": "","txn":txnId, "time": myDate, "error":"inerror1"});
			return;
		}

		//v1
		//var price = obj.innerInstructions[0].parsedInstructions[3].params.amount;
		var price = 0; var maxprice = 0.00001;
		if(obj.innerInstructions[0].parsedInstructions.length > 0){
			for(var t=0; t<obj.innerInstructions[0].parsedInstructions.length; t++){
				if(obj.innerInstructions[0].parsedInstructions[t].params.amount > maxprice){
					maxprice = obj.innerInstructions[0].parsedInstructions[t].params.amount;
				}
			}
		}
		price = maxprice;

		console.log("price  -> "+price);
		var inSol = Number(price)/1000000000;
		console.log("price  -> "+inSol);
		//console.log(inSol);

		response = await fetch('https://api.solscan.io/account?address='+latestAcc);
		await delay(1000);
		jsonresp = await response.text();
		obj = JSON. parse(jsonresp);
		if(obj==undefined || obj == null || obj.data == undefined || obj.data.tokenInfo == undefined ){
			result.push({ "name" : "" , "price" : inSol, "address": "","txn":txnId, "time": myDate, "error": "inerror2"});
			return;
		}
		var nftTokenAddr = obj.data.tokenInfo.tokenAddress; //console.log(nftTokenAddr)


		response = await fetch('https://api.solscan.io/account?address='+nftTokenAddr);
		await delay(1000);
		jsonresp = await response.text();
		obj = JSON. parse(jsonresp);

		var nftToken = obj.data.tokenInfo.name; //console.log(nftToken);


		console.log(" -------- "+nftToken+" ; "+inSol+" SOL");
		result.push({ "name" : nftToken , "price" : inSol, "address": nftTokenAddr,"txn":txnId, "time": myDate});
		fs.writeFileSync('result.json', JSON.stringify(result, null, 4));

}