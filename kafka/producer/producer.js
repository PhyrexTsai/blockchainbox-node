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
    producer = new HighLevelProducer(client);

function KafkaProducer() {
    
}

KafkaProducer.prototype.send = function(key, data) {
    message = {};
    message[key] = data;

    payloads = [
        { topic: 'InsertQueue', messages: JSON.stringify(message)}
    ];

    return producer.on('ready', function () {
        return producer.send(payloads, function (err, data) {
            // FIXME error handling 這邊如果有錯誤，可能要討論一下機制 是否重送？
            console.log(data);
            return data;
        });
    });
};

exports = module.exports = new KafkaProducer();



