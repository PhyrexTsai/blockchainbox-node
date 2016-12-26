var ProofOfTransaction = require('../ethereum/contract/proofoftransaction.js');

var txHash = "123450";
var data = "678900";

// setData to ProofOfTransaction contract
console.log('setData: ' + ProofOfTransaction.setData(txHash, data));
/* getDataHash response

0x9b3e95fbc3a10c04ad48cc83659b7e2eb1586f50b6e72930e39c15209755f7eb
*/

// getDataHash from ProofOfTransaction contract
console.log('getDataHash: ' + ProofOfTransaction.getDataHash(txHash));
/* getDataHash response

0xb85e556e8dd9af968f433c957838232cfec93ec19f70af539a9a715217d49ca9
*/

// listen event from blockchain of ProofOfTransaction contract
var setDataHashEvent = ProofOfTransaction.setDataHashEvent();
setDataHashEvent.watch(function(err, result) {
    console.log(result);
});
/* setDataHashEvent response

 { address: '0xd0f96ba2fedb74b92343de6ba3f1b3d55076b2b2',
 blockHash: '0x4f5e9bf1428d28b1c3639741f9e3cf3e3a2286d2c2301aff5a92ca76bd9c0354',
 blockNumber: 298605,
 logIndex: 0,
 removed: false,
 transactionHash: '0xd64326d1a2e436eb80d615b64b9661e5b2aeff04440119ba88746f45c96c0815',
 transactionIndex: 0,
 event: 'setDataHashEvent',
 args:
 { from: '0x2707318718f1c69ff55f5192cec64e117fdbbfde',
 txHash: '123450',
 dataHash: '0x4aa9108fe24f58fdfc88b20a12d268b9904abc4f6a33844dfe9fd7b5ff7fc9d2',
 time: { [String: '1482764226'] s: 1, e: 9, c: [Object] } } }

## TODO
from 寫入 TransactionData fromAddress
txHash 當作更新的 key
dataHash 寫入 TransactionData dataHash
blockNumber 寫入 TransactionData blockNumber
blockHash 寫入 TransactionData blockHash
time 寫入 TransactionData updateTimestamp
*/

// listen event from blockchain of ProofOfTransaction contract
var getDataHashEvent = ProofOfTransaction.getDataHashEvent();
getDataHashEvent.watch(function(err, result) {
    console.log(result);
});
/* getDataHashEvent response

{ address: '0xd0f96ba2fedb74b92343de6ba3f1b3d55076b2b2',
    blockHash: '0xc8890bae8bd6cca96c6a8602362659c5f0a8e9ab5536964dc8443f94b482315e',
    blockNumber: 298606,
    logIndex: 0,
    removed: false,
    transactionHash: '0xfcbde87be1080bf9724d0e3d8dbe1369764ca12d88a927448376546c7301b307',
    transactionIndex: 0,
    event: 'getDataHashEvent',
    args:
    { from: '0x2707318718f1c69ff55f5192cec64e117fdbbfde',
        txHash: '123450',
        dataHash: '0x4aa9108fe24f58fdfc88b20a12d268b9904abc4f6a33844dfe9fd7b5ff7fc9d2',
        time: { [String: '1482764355'] s: 1, e: 9, c: [Object] } } }
*/