var pool = require('../dbConnectionPool.js');

function ContractEvent() {}

ContractEvent.prototype.readAll = function() {
    return pool.query('SELECT * FROM contractEvent');
};

ContractEvent.prototype.read = function(id) {
    return pool.query('SELECT * FROM contractEvent WHERE id = $1', [id]);
};

ContractEvent.prototype.create = function(entity) {
    
};

ContractEvent.prototype.update = function() {

};

ContractEvent.prototype.delete = function() {

};

exports = module.exports = new ContractEvent();