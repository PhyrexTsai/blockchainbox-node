/**
 * Pool Use
 * Reference: https://github.com/brianc/node-pg-pool
 *
 * Prepare Statement
 * Reference: https://github.com/brianc/node-postgres/wiki/Parameterized-queries-and-Prepared-Statements#prepared-statements
 */

var pool = require('../dbConnectionPool.js');

function TransactionData() {}

TransactionData.prototype.readAll = function() {
    return pool.query('SELECT * FROM transactiondata');
}

TransactionData.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM transactiondata WHERE txHash = $1', [txHash]);
}

TransactionData.prototype.create = function(txHash) {
    return pool.query('SELECT * FROM transactiondata WHERE txHash = $1', [txHash]);
}

TransactionData.prototype.update = function() {

}

TransactionData.prototype.delete = function() {

}

// 這邊我打算把所有 access db 的東西都做成 singleton，目的是同一時間應該只允許一個實例在讀寫才合理
exports = module.exports = new TransactionData();