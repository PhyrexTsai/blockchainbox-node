/**
 * Need to unlock account first
 * 
 * Run command below: 
 * geth attach
 * personal.unlockAccount('4c25526a6b567c067396bd1fe0a1936117875436','password',600000);
 */
var Web3 = require('web3');
var web3 = new Web3();
var eth = web3.eth;

web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'));

var proofOfTransactionAbi = [{"constant":false,"inputs":[{"name":"txHash","type":"string"}],"name":"getDataHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"dataHash","outputs":[{"name":"","type":"bytes32"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"txHash","type":"string"},{"name":"data","type":"string"}],"name":"setData","outputs":[],"payable":false,"type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"txHash","type":"string"},{"indexed":false,"name":"dataHash","type":"bytes32"},{"indexed":false,"name":"time","type":"uint256"}],"name":"setDataHashEvent","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"txHash","type":"string"},{"indexed":false,"name":"dataHash","type":"bytes32"},{"indexed":false,"name":"time","type":"uint256"}],"name":"getDataHashEvent","type":"event"}];

var proofoftransaction = eth.contract(proofOfTransactionAbi)
// stored contract
    .at('0xD0F96Ba2FEDB74b92343De6ba3f1b3D55076B2B2');
proofoftransaction.setData("24", "48", {from: eth.coinbase, gas: 4700000});
// deploy
//     .new(
//     {
//         from: web3.eth.coinbase,
//         data: '0x606060405234610000575b6103fd806100186000396000f360606040526000357c010000000000000000000000000000000000000000000000000000000090048063048fb8621461004e5780631b3012a3146100bd5780638ca3c553146100e4575b610000565b34610000576100a3600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190505061017e565b604051808260001916815260200191505060405180910390f35b34610000576100ca6102b4565b604051808260001916815260200191505060405180910390f35b346100005761017c600480803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509190803590602001908201803590602001908080601f016020809104026020016040519081016040528093929190818152602001838380828437820191505050505050919050506102ba565b005b6000600182604051808280519060200190808383829060006004602084601f0104600302600f01f1509050019150509081526020016040518091039020546000819055507f5027e5950a561e4b1711909e6b3c5abd9c8dc6a609b8fdb6e7743b92fd1ca3c5338360005442604051808573ffffffffffffffffffffffffffffffffffffffff16815260200180602001846000191681526020018381526020018281038252858181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156102755780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a160006001026000546000191614156102a457600090506102af566102ae565b60005490506102af565b5b919050565b60005481565b80604051808280519060200190808383829060006004602084601f0104600302600f01f1509050019150506040518091039020600081905550600054600183604051808280519060200190808383829060006004602084601f0104600302600f01f1509050019150509081526020016040518091039020819055507f029d6ef8caed41aa2bd54f03b504084eacd5a06d946911f4603b5ca31c688a8e338360005442604051808573ffffffffffffffffffffffffffffffffffffffff16815260200180602001846000191681526020018381526020018281038252858181518152602001915080519060200190808383829060006004602084601f0104600302600f01f150905090810190601f1680156103e85780820380516001836020036101000a031916815260200191505b509550505050505060405180910390a15b505056',
//         gas: 4700000
//     }, function (e, contract){
//         console.log(e, contract);
//         if (typeof contract.address !== 'undefined') {
//             console.log('Contract mined! address: ' + contract.address + ' transactionHash: ' + contract.transactionHash);
//
//             contractControl(proofoftransaction, web3.eth);
//         }
//     });


function contractControl(proofOfTransaction, eth) {
    var txHash = "12";
    var data = "24";
    console.log('ProofOfTransaction.contractControl.proofOfTransaction: txHash = ' + txHash + ', data = ' + data);

    proofOfTransaction.setDataHashEvent({}, function(err, event) {
        console.log('setDataHashEvent');
        console.log(event);
    });

    proofOfTransaction.getDataHashEvent({}, function(err, event) {
        console.log('getDataHashEvent');
        console.log(event);
    });

    proofOfTransaction.setData(txHash, data, {
        from: web3.eth.coinbase,
        gas: 4700000
    });

    proofOfTransaction.getDataHash(txHash, {
        from: web3.eth.coinbase,
        gas: 4700000
    });
}