var pool = require('../dbConnectionPool.js');

function SearchTransaction() {}

SearchTransaction.prototype.readAll = function() {
    return pool.query('SELECT * FROM searchtransaction');
};

SearchTransaction.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM searchtransaction WHERE txHash = $1', [txHash]);
};

SearchTransaction.prototype.create = function(entity) {
    return null;
};

SearchTransaction.prototype.update = function(entity) {
    return null;
};

SearchTransaction.prototype.delete = function(id) {
    return pool.query("DELETE searchtransaction WHERE id = $1", [id]);
};

exports = module.exports = new SearchTransaction();