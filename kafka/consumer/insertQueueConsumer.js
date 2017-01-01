var ProofOfTransaction = require('../../ethereum/contract/proofoftransaction.js');
var transactionData = require('../../db/models/transactionData.js');
var producer = require('../producer/producer.js');

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
    ),
    HighLevelProducer = kafka.HighLevelProducer,
    producer = new HighLevelProducer(client);

consumer.on('message', function (message) {
    // console.log('message: ' + ( message.value));
    // console.log('type: ' + (typeof message.value));
    // console.log('message value: ' + JSON.parse(message.value));
    var key = getKey(JSON.parse(message.value));
    var value = JSON.parse(message.value)[key];
    var transactionHash = ProofOfTransaction.setData(key, value.toString());
    console.log('key: ', key, 'value: ', value.toString(), 'transactionHash: ' + transactionHash);
    var entity = {transactionHash: transactionHash,
        dataHash: null,
        status: transactionData.PENDING,
        blockNumber: -1,
        blockHash: null,
        fromAddress: "",
        txHash: key
    };
    //update postgres
    transactionData.update(entity).then(function (result) {
        var payloads = [
            {topic: "InsertCheckMinedQueue", messages: transactionHash}
        ];
        // Step 2: Put to Kafka queue
        // FIXME Kafka producer 要做 error handling，有錯要重送，這邊我測試如果沒有打開 Kafka 一樣會過
        producer.send(payloads);
    }).catch(function (err) {
        // error handle
        console.log(err.message, err.stack);
    });;
    //transactionData.updateTransactionHashByTxnHash(key, transactionHash, transactionData.PENDING);

    // FIXME Point 1
    // 這一隻 consumer 應該到 transactionData.updateTransactionHashByTxnHash 就結束了
    // 下面這兩個動作應該是另外一個 consumer 去做才對



    // FIXME Point 2
    // 這個應該是要去確認是否 gas 有沒有用光，然後更新 transactionData，如果 gas 等於 4700000 就代表 failed
    //listen
    // EventListener.filterWatch(transactionHash, function(transactionInfo, transactionReceiptInfo, blockInfo) {
    //     console.log('transaction info: ', transactionInfo);
    //     console.log('transaction receipt info: ', transactionReceiptInfo);
    //     console.log('block info: ', blockInfo);
    //     transactionData.updateToApproved(transactionHash, );
    // });

    // FIXME Point 3
    // 這邊應該改成去聽 ProofOfTransaction.setDataHashEvent(key);
    // 如果有回來才去做 transactionData.updateToApproved，然後 key 應該要用 setDataHashEvent 回傳回來的參數來做 update 的 key
    // getDataHash from ProofOfTransaction contract
    // var getDataHashTransactionHash = ProofOfTransaction.getDataHash(key);
    // console.log('getDataHash: ' + getDataHashTransactionHash);
    // transactionData.updateToApproved(key, getDataHashTransactionHash);
    //
    // console.log('!!!!!!!')


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
