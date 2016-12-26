var transactionData = require('../db/models/transactionData.js');
var transactionDataEntity = {"data":{"hello":"world"}};

transactionData.create(transactionDataEntity).then(function(result) {
    console.log('insert to db finished.');
    console.log('txHash: ' + result);
    console.log('start to produce to kafka.');
    var kafka = require('kafka-node'),
    txHash = result,
    HighLevelProducer = kafka.HighLevelProducer,
    client = new kafka.Client("127.0.0.1:2181"),
    producer = new HighLevelProducer(client),
    message = {}

    message[txHash] = transactionDataEntity
    
    console.log(message)
    console.log(JSON.stringify(message));
   
    payloads = [
        { topic: 'InsertQueue', messages: JSON.stringify(message)}
    ];

    producer.on('ready', function () {
    	producer.send(payloads, function (err, data) {
        	console.log(data);
    	});
    });
    
}).catch(function (err) {
    // error handle
    console.log(err.message, err.stack);
});
