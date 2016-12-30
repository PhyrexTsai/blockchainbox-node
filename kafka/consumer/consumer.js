var ProofOfTransaction = require('../../ethereum/contract/proofoftransaction.js');
var transactionData = require('../../db/models/transactionData.js');
var EventListener = require('../../ethereum/listener/eventlistener.js');

var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client('127.0.0.1:2181'),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'InsertQueue' , partition: 0}
        ],
        {
            autoCommit: true
        }
    );

consumer.on('message', function (message) {
    console.log('message: ' + ( message.value));
    console.log('type: ' + (typeof message.value));
    console.log('message value: ' + JSON.parse(message.value));
    var key = getKey(JSON.parse(message.value));
    console.log('key: ' + key);
    var value = JSON.parse(message.value)[key];
    console.log('value: ' + JSON.stringify(value));

    //inset to blockchain and get transactionHash
    var transactionHash = ProofOfTransaction.setData(key, JSON.stringify(value));
    //update postgres
    console.log('transactionHash: ' + transactionHash);
    transactionData.updateTransactionHashByTxnHash(key, transactionHash, transactionData.PENDING);

    //listen
    EventListener.filterWatch(transactionHash, function(transctionInfo, transactionReceiptInfo, blockInfo) {
      console.log('transaction info: ', transctionInfo);
      console.log('transaction receipt info: ', transactionReceiptInfo);
      console.log('block info: ', blockInfo);
    });
    // getDataHash from ProofOfTransaction contract
    var getDataHashTransactionHash = ProofOfTransaction.getDataHash(key);
    console.log('getDataHash: ' + getDataHashTransactionHash);
    transactionData.updateToApproved(key, getDataHashTransactionHash);

    console.log('!!!!!!!')


    // listen event from blockchain of ProofOfTransaction contract
    // var setDataHashEvent = ProofOfTransaction.setDataHashEvent();
    // setDataHashEvent.watch(function(err, result) {
    //     if (result.transactionHash == setDataTransactionHash) {
    //         console.log('setDataHashEvent: ', result);
    //         setDataHashEvent.stopWatching();
    //     }
    // });

    // listen event from blockchain of ProofOfTransaction contract
    // var getDataHashEvent = ProofOfTransaction.getDataHashEvent();
    // getDataHashEvent.watch(function(err, result) {
    //     if (result.transactionHash == getDataHashTransactionHash) {
    //         console.log('getDataHashEvent: ', result);
    //         getDataHashEvent.stopWatching();
    //     }
    // });
});

function getKey(obj) {
  var result = "";
  
  for (var p in obj) {
    if( obj.hasOwnProperty(p) ) {
      result += p ;
    } 
  }              
  return result;
}

console.log("consumer start");
