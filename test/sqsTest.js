var sqs = require('../aws/sqs/sqsUtil.js');

//sqs.list();
//sqs.create('InsertQueue');
sqs.send('testtesttststsetst', 'https://sqs.ap-northeast-1.amazonaws.com/285456268804/InsertQueue', 10);
sqs.receive('https://sqs.ap-northeast-1.amazonaws.com/285456268804/InsertQueue', 6000);
