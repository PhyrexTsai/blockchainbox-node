var pool = require('../dbConnectionPool.js');

function SearchTransaction() {}

SearchTransaction.prototype.readAll = function() {
    return pool.query('SELECT * FROM searchtransaction');
};

SearchTransaction.prototype.read = function(txHash) {
    return pool.query('SELECT * FROM searchtransaction WHERE txHash = $1', [txHash]);
};

SearchTransaction.prototype.create = function(entity) {
    return pool.query('INSERT INTO searchtransaction (txHash, network, createTimestamp, fromAddress, status)' +
        ' VALUES ($1, $2, now(), $3, $4)', 
        [entity.txHash, 'testnet', entity.fromAddress, entity.status]).then(function(result) {
        return result.rows[0].id;
    }).catch(function(err) {
        console.log(err.message, err.stack);
        return null;
    });
};

SearchTransaction.prototype.update = function(entity) {
    return pool.query('UPDATE searchtransaction SET status = $1, WHERE txHash = $2', 
        [entity.status, entity.txHash]).then(function(result) {
        console.log(result);
        return true;
    }).catch(function(err) {
        console.log(err.message, err.stack);
        return false;
    });
};

SearchTransaction.prototype.delete = function(id) {
    return pool.query("DELETE searchtransaction WHERE id = $1", [id]);
};

exports = module.exports = new SearchTransaction();