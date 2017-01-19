var Web3 = require('web3');
var contract = require('../db/models/contract.js');
var contractFunction = require('../db/models/contractFunction.js');
var contractEvent = require('../db/models/contractEvent.js');
var web3 = new Web3();

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var contractId = 19;
var contractAddress = '0xD0F96Ba2FEDB74b92343De6ba3f1b3D55076B2B2';

contract.read(contractId).then(function(result){
	var abi = result.rows[0].abi;
	var address = result.rows[0].address;

	console.log(abi);
	var contractInstance = web3.eth.contract(JSON.parse(abi)).at(contractAddress);

	// 這邊要 dynamic 呼叫動態的 function，然後 parsing
	// contractInstance.apply();

});


