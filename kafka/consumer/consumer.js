var ProofOfTransaction = require('../../ethereum/contract/proofoftransaction.js');

var kafka = require('kafka-node'),
    HighLevelConsumer = kafka.HighLevelConsumer,
    client = new kafka.Client('127.0.0.1:2181'),
    consumer = new HighLevelConsumer(
        client,
        [
            { topic: 'InsertQueue' , offset:40,partition: 0}
        ],
        {
            autoCommit: false,fromOffset: true 
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

    //inset to blockchain
    ProofOfTransaction.setData(key, JSON.stringify(value));
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

function showObject(obj) {
  var result = "";
  
  for (var p in obj) {
    if( obj.hasOwnProperty(p) ) {
      result += p + " , " + obj[p] + "\n";
    } 
  }              
  return result;
}



console.log("consumer start");
