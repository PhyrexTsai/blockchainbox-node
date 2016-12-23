/**
 * impliment Kafka
 *
 * 1. Client producer
 * 2. Transaction consumer
 * 3. Event consumer -> write to Database
 * 4. Web3 event producer, include web3 error handling
 * 
 */
var transactionData = require('../db/models/transactionData.js');

transactionData.read('test').then(function(result) {
    // get result
    console.log('read.rowCount: ' + result.rowCount);
}).catch(function (err) {
    // error handle
        console.log(err.message, err.stack);
});
