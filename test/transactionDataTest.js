var transactionData = require('../db/models/transactionData.js');
var transactionDataEntity = {"data":'{"hello":"world"}'};

transactionData.create(transactionDataEntity).then(function(result) {
    // get result
    console.log('txHash: ' + result);
}).catch(function (err) {
    // error handle
    console.log(err.message, err.stack);
});