var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client('127.0.0.1:2181'),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'InsertQueue' , partition: 0}
        ],
        {
            autoCommit: false,
        }
    );

consumer.on('message', function (message) {
    console.log(message);
});



console.log("consumer start");
