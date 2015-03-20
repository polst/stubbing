var chalk = require('chalk');
var dateformat = require('dateformat');

var log = function(){
  var time = '[' + chalk.blue('STB') + ']['+chalk.grey(dateformat(new Date(), 'HH:MM:ss'))+']';
  var args = Array.prototype.slice.call(arguments);
  args.unshift(time);
  console.log.apply(console, args);
  return this;
};

log.success = function(e) {
  log(chalk.green(e))
};

log.info = function(e) {
  log(chalk.yellow(e))
};

log.error = function(e) {
  log(chalk.red(e))
};

module.exports.log = log;
