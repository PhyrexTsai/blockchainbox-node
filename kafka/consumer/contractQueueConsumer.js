var contract = require('../../db/models/contract.js');

var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client('127.0.0.1:2181'),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'ContractQueue' , partition: 0}
        ],
        {
            autoCommit: false
        }
    ),
    HighLevelProducer = kafka.HighLevelProducer,
    producer = new HighLevelProducer(client);

consumer.on('message', function (message) {

});