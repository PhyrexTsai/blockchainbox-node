var ProofOfTransaction = require('../../ethereum/contract/proofoftransaction.js');
var transactionData = require('../../db/models/transactionData.js');
var EventListener = require('../../ethereum/listener/eventlistener.js');

var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client('127.0.0.1:2181'),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'InsertCheckMinedQueue' , partition: 0}
        ],
        {
            autoCommit: true
        }
    );

consumer.on('message', function (message) {
    console.log('eventListener: ', message.value);

    // listen setDataHashEvent from blockchain of ProofOfTransaction contract
    var setDataHashEvent = ProofOfTransaction.setDataHashEvent();
    setDataHashEvent.watch(function(err, result) {
        //console.log('1212121212128590348590348590')
        if (result.transactionHash == message.value) {
            console.log('setDataHashEvent: ', result);
            var entity = {
                txHash: result.args.txHash,
                transactionHash: result.transactionHash,
                dataHash: result.args.dataHash,
                fromAddress: result.args.from
            };
            transactionData.updateDataHash(entity).then(function(result) {
                console.log('[SUCCESS] TransactionData.updateDataHash: ', entity);
            }).catch(function (err) {
                // error handle
                console.log(err.message, err.stack);
            });
            setDataHashEvent.stopWatching();
        } else {
            console.log('error: ' + err);
            setDataHashEvent.stopWatching();
        }
    });

    //listen blockchain
    EventListener.filterWatch(message.value, function(transactionInfo, transactionReceiptInfo, blockInfo) {
         console.log('transaction info: ', transactionInfo);
         console.log('transaction receipt info: ', transactionReceiptInfo);
         console.log('block info: ', blockInfo);

        var txStatus = transactionData.CONFIRMED;
        if (transactionInfo.gas == transactionReceiptInfo.gasUsed) {
            txStatus = transactionData.FAILED;
        }

        var entity = {transactionHash: message.value,
            dataHash: null,
            status: txStatus,
            blockNumber: transactionInfo.blockNumber,
            blockHash: transactionInfo.blockHash,
            fromAddress: transactionInfo.from,
            gas: transactionReceiptInfo.gasUsed
        };

        transactionData.updateByTransactionHash(entity).then(function(result) {
            console.log('[SUCCESS] TransactionData.updateByTransactionHash: ', entity);
        }).catch(function (err) {
            // error handle
            console.log(err.message, err.stack);
        });
    });
});

console.log("[START CONSUMER] EventListener");
