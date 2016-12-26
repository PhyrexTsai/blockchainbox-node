function Test() {

}

Test.prototype.param4 = "param4";
var param3 = "param3";

function param1() {
    return "hi";
};

Test.prototype.test = function(param2) {
    console.log('function: test');
    console.log('test.param1: ' + param1());
    console.log('test.param2: ' + param2);
    console.log('test.param3: ' + param3);
    console.log('test.param4: ' + this.param4);
    test2(param2);
    Test.prototype.test3();
};

function test2(param2) {
    console.log('test2 call');
    console.log('test2.param1: ' + param1());
    console.log('test2.param2: ' + param2);
    console.log('test2.param3: ' + param3);
    console.log('test2.param4: ' + Test.prototype.param4);
    Test.prototype.test3();
}

Test.prototype.test3 = function() {
    console.log('test3 execute');
}

exports = module.exports = new Test();