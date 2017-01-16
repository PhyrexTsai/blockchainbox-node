var pool = require('../dbConnectionPool.js');

function ContractFunction() {}

ContractFunction.prototype.readAll = function() {
    return pool.query('SELECT * FROM contractFunction');
};

ContractFunction.prototype.read = function(id) {
    return pool.query('SELECT * FROM contractFunction WHERE id = $1', [id]);
};

ContractFunction.prototype.create = function(entity) {
    
};

ContractFunction.prototype.update = function() {

};

ContractFunction.prototype.delete = function() {

};

exports = module.exports = new ContractFunction();