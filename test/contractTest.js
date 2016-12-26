var ProofOfTransaction = require('../contract/proofoftransaction.js');

var txHash = "123450";
var data = "678900";
//ProofOfTransaction.setData(txHash, data);
console.log('setData: ' + ProofOfTransaction.setData(txHash, data));
console.log('getDataHash: ' + ProofOfTransaction.getDataHash(txHash));
var setDataHashEvent = ProofOfTransaction.setDataHashEvent();
setDataHashEvent.watch(function(err, result) {
    console.log(result);
});
var getDataHashEvent = ProofOfTransaction.getDataHashEvent();
getDataHashEvent.watch(function(err, result) {
    console.log(result);
});
