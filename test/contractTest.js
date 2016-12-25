var ProofOfTransaction = require('../contract/proofoftransaction.js');

var txHash = "123450";
var data = "678900";
//ProofOfTransaction.setData(txHash, data);
ProofOfTransaction.setData(txHash, data);
console.log(ProofOfTransaction.getDataHash(txHash));