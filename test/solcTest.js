var solc = require('solc');
var util = require('util');
var contract = require('../db/models/contract.js');
var contractFunction = require('../db/models/contractFunction.js');
var contractEvent = require('../db/models/contractEvent.js');

var input = "contract ProofOfTransaction {bytes32 public dataHash;mapping (string => bytes32) dataHashMap;event setDataHashEvent(address from, string txHash, bytes32 dataHash, uint time);event getDataHashEvent(address from, string txHash, bytes32 dataHash, uint time);function setData(string txHash, string data) {dataHash = sha3(data);dataHashMap[txHash] = dataHash;setDataHashEvent(msg.sender, txHash, dataHash, now);}function getDataHash(string txHash) returns (bytes32) {dataHash = dataHashMap[txHash];getDataHashEvent(msg.sender, txHash, dataHash, now);if (dataHash == 0) {return \"\";} else {return dataHash;}}}";
var result = solc.compile(input, 1); // 1 activates the optimiser

    // code and ABI that are needed by web3
    //console.log(contractName + ': ' + result.contracts[contractName].bytecode);
    //console.log(contractName + '; ' + JSON.parse(result.contracts[contractName].interface));
    //console.log(JSON.stringify(result.contracts[contractName].interface));
    //console.log(util.inspect(result.contracts[contractName].interface, false, null));
    //console.log(util.inspect(result.contracts[contractName], false, null));

    // var abi = result.contracts[contractName].interface;
    // JSON.parse(abi).forEach(function(data){
    // 	if (data.type == 'function') {
    // 		console.log('function', JSON.stringify(data));
    // 	}
    // 	if (data.type == 'event') {
    // 		console.log('event', JSON.stringify(data));
    // 	}
    // });

    var id = [];
        for (var contractName in result.contracts) {
            var abi = result.contracts[contractName].interface;
            var contractEntity = {
                name: contractName, 
                sourceCode: input,//req.body.sourceCode,
                byteCode: result.contracts[contractName].bytecode,
                language: result.contracts[contractName].metadata.language,
                compilerVersion: result.contracts[contractName].metadata.compiler,
                abi: util.inspect(result.contracts[contractName].interface, false, null),
                // have to check [solc]
                gasEstimates: 0//web3.eth.estimateGas({data: result.contracts[contractName].bytecode})
            };

            contract.create(contractEntity).then(function (contractId) {
            	console.log('contractId: ' + contractId);
                id.push(contractId);

                JSON.parse(abi).forEach(function(data){
                	console.log(data.type);
                    if (data.type == 'function') {
                        var contractEventEntity = {
                            contractId: contractId,
                            eventName: data.name,
                            eventParameters: data
                        };
                        // TODO insert contractEvent and contractFunction
                        contractEvent.create(contractEventEntity).then(function (contractEventId) {
                            console.log('contractEventId', contractEventId);
                        }).catch(function (err) {
                            console.log(err.message, err.stack);
                        });
                    }
                    if (data.type == 'event') {
                        var contractFunctionEntity = {
                            contractId: contractId,
                            functionName: data.name,
                            functionParameters: data
                        };
                        contractFunction.create(contractFunctionEntity).then(function (contractFunctionId) {
                            console.log('contractFunctionId', contractFunctionId);
                        }).catch(function (err) {
                            console.log(err.message, err.stack);
                        });
                    }
                });
            }).catch(function(err){
            	console.log(err.message, err.stack);
            });
        }
        
console.log('id', id);