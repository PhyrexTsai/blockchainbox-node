var aws = require('aws-sdk');
function SqsUtil() {}


// Load AWS credentials and try to instantiate the object.
aws.config.loadFromPath(__dirname + '/config.json');

// Instantiate SQS.
var sqs = new aws.SQS();


//List queues
SqsUtil.prototype.list = function() {
    sqs.listQueues(function(err, data) {
        if(err) {
            console.log(err);
        } 
        else {
            console.log(data);
        } 
    });
};

// Creating a queue.
SqsUtil.prototype.create = function(queueName) {

	var params = {
        QueueName: queueName
    };

    sqs.createQueue(params, function(err, data) {
        if(err) {
             console.log(err);
        } 
        else {
             console.log(data);
        } 
    });
};


// Send a message
SqsUtil.prototype.send = function(messageBody, queueUrl, delaySeconds) {

	var params = {
        MessageBody: messageBody,
        QueueUrl: queueUrl,
        DelaySeconds: delaySeconds
    };

    sqs.sendMessage(params, function(err, data) {
        if(err) {
             console.log(err);
        } 
        else {
             console.log( data);
        } 
    });
};


//Receive a message
SqsUtil.prototype.receive = function(queueUrl, visibilityTimeout) {

	var params = {
        QueueUrl: queueUrl,
        VisibilityTimeout: visibilityTimeout
    };
    
    sqs.receiveMessage(params, function(err, data) {
        if(err) {
             console.log(err);
        } 
        else {
             console.log('receive:  ' + data['Messages'][0]['Body']);
        } 
    });
};

//Delete a message
SqsUtil.prototype.delete = function(queueUrl, receipt) {

	var params = {
        QueueUrl: queueUrl,
        ReceiptHandle: receipt
    };
    
    sqs.deleteMessage(params, function(err, data) {
        if(err) {
             console.log(err);
        } 
        else {
             console.log(data);
        } 
    });
};

//purge a queue
SqsUtil.prototype.purge = function(queueUrl) {

	 var params = {
        QueueUrl: queueUrl
    };
    
    sqs.purgeQueue(params, function(err, data) {
        if(err) {
             console.log(err);
        } 
        else {
             console.log(data);
        } 
    });
};

exports = module.exports = new SqsUtil();