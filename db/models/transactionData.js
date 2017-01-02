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

TransactionData.prototype.UNAPPROVED = 'UNAPPROVED';
TransactionData.prototype.PENDING = 'PENDING';
TransactionData.prototype.APPROVED = 'APPROVED';
TransactionData.prototype.FAILED = 'FAILED';

TransactionData.prototype.readAll = function() {
    console.log('123');
    return pool.query('SELECT * FROM transactiondata');
};

TransactionData.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM transactiondata WHERE txHash = $1', [txHash]);
};

TransactionData.prototype.create = function(entity) {
    return pool.query("SELECT nextval(pg_get_serial_sequence('transactiondata', 'txid')) as txId;").then(function(result) {
        var txId = result.rows[0].txid;
        var txHash = keccak_256(txId);
        console.log('txId: ' + txId + ', txHash: ' + txHash);
        return pool.query("INSERT INTO transactiondata (txid, txhash, data, status, network, txtimestamp) " +
            "values ($1, $2, $3, $4, $5, $6)",
            [txId, txHash, entity.data, TransactionData.prototype.UNAPPROVED, 'testnet', 'now']).then(function(){
            return txHash;
        }).catch(function (err) {
            console.log(err.message, err.stack);
        });
    }).catch(function (err) {
        console.log(err.message, err.stack);
    });
};

TransactionData.prototype.update = function(entity) {
    // TODO 定義 status
    return pool.query("UPDATE transactiondata SET " +
        "transactionhash = $1, datahash = $2, status = $3, blocknumber = $4, blockhash = $5, fromAddress = $6, updateTimestamp = now() WHERE txhash = $7",
        [entity.transactionHash, entity.dataHash, entity.status, entity.blockNumber, entity.blockHash, entity.fromAddress, entity.txHash]);
};

TransactionData.prototype.delete = function(txHash) {
    return pool.query("DELETE transactiondata WHERE txHash = $1", [txHash]);
};

TransactionData.prototype.updateByTransactionHash = function(entity) {
    return pool.query("UPDATE transactiondata SET " +
        "status = $1, blocknumber = $2, blockhash = $3, updateTimestamp = now(), gas = $4 WHERE transactionHash = $5",
        [entity.status, entity.blockNumber, entity.blockHash, entity.gas, entity.transactionHash]);
};

TransactionData.prototype.updateDataHash = function(entity) {
    return pool.query("UPDATE transactiondata SET " +
        "datahash = $1, status = $2, fromAddress = $3, updateTimestamp = now() WHERE transactionHash = $4 AND txHash = $5",
        [entity.dataHash, TransactionData.prototype.APPROVED, entity.fromAddress, entity.transactionHash, entity.txHash]);
};

// 這邊我打算把所有 access db 的東西都做成 singleton，目的是同一時間應該只允許一個實例在讀寫才合理
exports = module.exports = new TransactionData();