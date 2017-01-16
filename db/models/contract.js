var pool = require('../dbConnectionPool.js');

function Contract() {}

Contract.prototype.UNCONFIRMED = 'UNCONFIRMED';
Contract.prototype.PENDING = 'PENDING';
Contract.prototype.CONFIRMED = 'CONFIRMED';
Contract.prototype.FAILED = 'FAILED';

Contract.prototype.readAll = function() {
    return pool.query('SELECT * FROM contract');
};

Contract.prototype.read = function(id) {
    return pool.query('SELECT * FROM contract WHERE id = $1', [id]);
};

Contract.prototype.create = function(entity) {
    return pool.query("INSERT INTO contract (name, sourceCode, byteCode, language, compilerVersion, abi, createTimestamp, gasEstimates, status) VALUES " +
        "(?, ?, ?, ?, ?, ?, now(), ?, ?)",
        [entity.name, entity.sourceCode, entity.byteCode, entity.language, entity.compilerVersion, entity.abi, entity.gasEstimates, Contract.prototype.UNCONFIRMED]);
};

Contract.prototype.update = function() {

};

Contract.prototype.delete = function() {

};

exports = module.exports = new Contract();