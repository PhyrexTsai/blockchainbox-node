// TODO 這邊還要補齊 /v1/status，與測試程式
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
 * @param data
 */
router.put('/v1/data', function(req, res, next) {
    // Step 1: Insert TransactionData
    if (req.body.data != null && req.body.data != '') {
        transactionData.create({data: JSON.stringify(req.body.data)}).then(function (result) {
            // 寫入 kafka
            var message = {txHash: result};
            var payloads = [
                {topic: kafkaTopic, messages: JSON.stringify(message)}
            ];
            // Step 2: Put to Kafka queue
            producer.on('ready', function () {
                producer.send(payloads, function (err, data) {
                    console.log(data);
                });
            });
            res.json({'data': {'txHash': result}});
        }).catch(function (err) {
            // error handle
            console.log(err.message, err.stack);
            res.json({'error': {'message': err.message}});
        });
    } else {
        res.json({'error': {'message': 'invalid data'}});
    }
});

/**
 * Get txHash information
 * @param txHash
 */
router.get('/v1/status', function(req, res, next) {
    if (req.query.txHash != null && req.query.txHash != '') {
        transactionData.read(req.query.txHash).then(function(result){
            console.log(result);
            // FIXME 這邊要看狀態把資料丟出去
            if (result.rowCount > 0) {
                res.json({'data': {'status': result.rows[0].status}});
            } else {
                res.json({'error': {'message': 'invalid txHash'}});
            }
        }).catch(function (err) {
            console.log(err.message, err.stack);
            res.json({'error': {'message': err.message}});
        });
    } else {
        res.json({'error': {'message': 'invalid txHash'}});
    }
});

module.exports = router;
