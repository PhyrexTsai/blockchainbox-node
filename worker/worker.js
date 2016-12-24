/**
 * impliment Kafka
 *
 * 1. Client producer
 * 2. Transaction consumer
 * 3. Event consumer -> write to Database
 * 4. Web3 event producer, include web3 error handling
 * 
 */

var kafka = require('kafka-node'),
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client("127.0.0.1:2181"),
    producer = new HighLevelProducer(client),
    payloads = [
        { topic: 'InsertQueue', messages: 'hello3' }
       
    ];
producer.on('ready', function () {
    producer.send(payloads, function (err, data) {
        console.log(data);
    });
});

console.log("producer start");

var transactionData = require('../db/models/transactionData.js');

transactionData.read('test').then(function(result) {
    // get result
    console.log('read.rowCount: ' + result.rowCount);
}).catch(function (err) {
    // error handle
        console.log(err.message, err.stack);
});

