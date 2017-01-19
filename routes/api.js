// TODO 這邊還要補齊 /v1/status，與測試程式
var express = require('express');
var transactionData = require('../db/models/transactionData.js');
var searchTransaction = require('../db/models/searchTransaction.js');
var producer = require('../kafka/producer/producer.js');
var Web3 = require('web3');
var web3 = new Web3();
var router = express.Router();

var kafkaTopic = 'InsertQueue';
web3.setProvider(new web3.providers.HttpProvider(process.env.ENODE_BASE || 'http://localhost:8545'));

/**
 * 把基本服務的 API 都放在這邊
 */

/**
 * PUT data
 * 把資料存入，回傳 txHash
 * Example:
 *   curl --request PUT "http://localhost:3000/api/v1/data" --data '{"data":"your data here"}' -H "Content-Type: application/json"
 * @param data
 */
router.put('/v1/data', function(req, res, next) {
    // Step 1: Insert TransactionData
    if (req.body.data != null && req.body.data != '') {
        transactionData.create({"data": req.body.data.toString()}).then(function (result) {
            // 寫入 kafka            
            message[result] = req.body.data.toString();

            var payloads = [
                {topic: kafkaTopic, messages: JSON.stringify(message)}
            ];
            // Step 2: Put to Kafka queue
            // FIXME Kafka producer 要做 error handling，有錯要重送，這邊我測試如果沒有打開 Kafka 一樣會過
            producer.send(payloads);
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
 * Get All Data
 * 拿table中全部的資料，初始化實用
 */
router.get('/v1/all', function(req, res, next) {
    transactionData.readAll().then(function(result){
       // console.log('typeof: ' + typeof result);
       // console.log('object: ' + JSON.parse(JSON.stringify(result)));
       res.json(result.rows);
    })
    .catch(function (err) {
        console.log(err.message, err.stack);
        res.json({'error': {'message': err.message}});
    });
    
});
/**
 * Get txHash information
 * Example:
 *   curl --request GET "http://localhost:3000/api/v1/status?txHash=13600b294191fc92924bb3ce4b969c1e7e2bab8f4c93c3fc6d0a51733df3c060"
 * @param txHash
 */
router.get('/v1/status', function(req, res, next) {
    if (req.query.txHash != null && req.query.txHash != '') {
        transactionData.read(req.query.txHash).then(function(result){
            console.log(result);
            // FIXME 這邊要看狀態把資料丟出去
            var transaction = {txHash: req.query.txHash, fromAddress: web3.eth.coinbase};
            if (result.rowCount > 0) {
                //transaction[status] = result.rows[0].status;
                //searchTransaction.create(transaction);
                res.json({'data': {
                    'txHash': result.rows[0].txhash,
                    'status': result.rows[0].status,
                    'transactionTimestamp': result.rows[0].txtimestamp,
                    'updateTimestamp': result.rows[0].updatetimestamp,
                    'transactionHash': result.rows[0].transactionhash,
                    'dataHash': result.rows[0].datahash,
                    'blockNumber': result.rows[0].blocknumber,
                    'blockHash': result.rows[0].blockhash,
                    'gasUsed': result.rows[0].gas,
                    'network': result.rows[0].network
                    }
                });
            } else {
                //transaction[status] = 'ERROR';
                //searchTransaction.create(transaction);
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
