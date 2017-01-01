var schedule = require('node-schedule');
 
var j = schedule.scheduleJob('* * * * * *', function(){
  console.log('The answer to life, the universe, and everything!');
});