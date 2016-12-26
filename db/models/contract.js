var pool = require('../dbConnectionPool.js');

function Contract() {}

Contract.prototype.readAll = function() {
    return pool.query('SELECT * FROM contract');
};

Contract.prototype.read = function(id) {
    return pool.query('SELECT * FROM contract WHERE id = $1', [id]);
};

Contract.prototype.create = function(id) {
    
};

Contract.prototype.update = function() {

};

Contract.prototype.delete = function() {

};

exports = module.exports = new Contract();