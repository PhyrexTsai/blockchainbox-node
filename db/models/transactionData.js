/**
 * Pool Use
 * Reference: https://github.com/brianc/node-pg-pool
 *
 * Prepare Statement
 * Reference: https://github.com/brianc/node-postgres/wiki/Parameterized-queries-and-Prepared-Statements#prepared-statements
 */

var pool = require('../dbConnectionPool.js');
var keccak_256 = require('js-sha3').keccak_256;

function TransactionData() {}

TransactionData.prototype.readAll = function() {
    return pool.query('SELECT * FROM transactiondata');
};

TransactionData.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM transactiondata WHERE txHash = $1', [txHash]);
};

TransactionData.prototype.create = function(entity) {
    return pool.query("SELECT nextval(pg_get_serial_sequence('transactiondata', 'txid')) as txId;").then(function(result) {
        // calculate txHash
        var txId = result.rows[0].txid;
        console.log('txId: ' + txId );
        var txHash = keccak_256(txId);
        // console.log('txId: ' + txId + ', txHash: ' + txHash);
        return pool.query("INSERT INTO transactiondata (txid, txhash, data, status, network, txtimestamp) " +
            "values ($1, $2, $3, $4, $5, $6)",
            [txId, txHash, entity.data, 'UNAPPROVED', 'testnet', 'now']).then(function(){
            return txHash;
        }).catch(function (err) {
            console.log(err.message, err.stack);
        });
    }).catch(function (err) {
        console.log(err.message, err.stack);
    });
};

TransactionData.prototype.update = function(entity) {
    return pool.query("UPDATE transactiondata SET " +
        "transactionhash = $1, datahash = $2, status = $3, blocknumber = $4, blockhash = $5, fromAddress = $6 WHERE txhash = $7",
        [entity.transactionHash, entity.dataHash, entity.status, entity.blockNumber, entity.blockHash, entity.fromAddress, entity.txHash]);
};

TransactionData.prototype.delete = function(txHash) {
    return pool.query("DELETE transactiondata WHERE txHash = $1", [txHash]);
};

// 這邊我打算把所有 access db 的東西都做成 singleton，目的是同一時間應該只允許一個實例在讀寫才合理
exports = module.exports = new TransactionData();