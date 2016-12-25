var express = require('express');
var transactionData = require('../db/models/transactionData.js');
var router = express.Router();

/**
 * 把基本服務的 API 都放在這邊
 */

/**
 * PUT data
 * 把資料存入，回傳 txHash
 */
router.put('/v1/data', function(req, res, next) {
    // implement create db
    transactionData.create({}).then(function(result) {
        // get result
        // console.log('read.rowCount: ' + result.rowCount);
    }).catch(function (err) {
        // error handle
        // console.log(err.message, err.stack);
    });
    // implement kafka producer
    res.json({'data': "OK"});
});


router.get('/v1/status', function(req, res, next) {
    // TODO 查詢資料庫的資料
    res.json({'data': 'PENDING'});
});

module.exports = router;
