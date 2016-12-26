var express = require('express');
var transactionData = require('../db/models/transactionData.js');
var producer = require('../kafka/producer/producer.js');
var router = express.Router();

var kafkaTopic = "InsertQueue";
/**
 * 把基本服務的 API 都放在這邊
 */

/**
 * PUT data
 * 把資料存入，回傳 txHash
 */
router.put('/v1/data', function(req, res, next) {
    // Step 1: Insert TransactionData
    transactionData.create({data: JSON.stringify(req.body.data)}).then(function(result) {
        // 寫入 kafka
        var message = {txHash: result};
        var payloads = [
            { topic: kafkaTopic, messages: JSON.stringify(message)}
        ];
        // Step 2: Put to Kafka queue
        producer.on('ready', function () {
            producer.send(payloads, function (err, data) {
                console.log(data);
            });
        });
        res.json({'data':{'txHash': result}});
    }).catch(function (err) {
        // error handle
        console.log(err.message, err.stack);
        res.json({'error': {'message': err.message}});
    });
});


router.get('/v1/status', function(req, res, next) {
    // TODO 查詢資料庫的資料
    res.json({'data': 'PENDING'});
});

module.exports = router;
