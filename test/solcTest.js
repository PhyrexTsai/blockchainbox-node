var solc = require('solc');
var util = require('util');

var input = "contract ProofOfTransaction {bytes32 public dataHash;mapping (string => bytes32) dataHashMap;event setDataHashEvent(address from, string txHash, bytes32 dataHash, uint time);event getDataHashEvent(address from, string txHash, bytes32 dataHash, uint time);function setData(string txHash, string data) {dataHash = sha3(data);dataHashMap[txHash] = dataHash;setDataHashEvent(msg.sender, txHash, dataHash, now);}function getDataHash(string txHash) returns (bytes32) {dataHash = dataHashMap[txHash];getDataHashEvent(msg.sender, txHash, dataHash, now);if (dataHash == 0) {return \"\";} else {return dataHash;}}}";
var output = solc.compile(input, 1); // 1 activates the optimiser
for (var contractName in output.contracts) {
    // code and ABI that are needed by web3
    //console.log(contractName + ': ' + output.contracts[contractName].bytecode);
    //console.log(contractName + '; ' + JSON.parse(output.contracts[contractName].interface));
    //console.log(JSON.stringify(output.contracts[contractName].interface));
    //console.log(util.inspect(output.contracts[contractName].interface, false, null));
    console.log(util.inspect(output.contracts[contractName], false, null));
}