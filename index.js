var util = require('util');
var chalk = require('chalk');

var log = module.exports = {};

var levels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

log.quiet = false;

log.width = 15;
log.level = 'info';

log.log = function(level, msg) {
  if (levels[level] >= levels[log.level] && log.quiet === false) {
    if (console[level]) {
      console[level](msg);
    } else {
      console.log(msg);
    }
  }
};

log.debug = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('debug', getMsg(category, msg, chalk.white));
};

log.info = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('info', getMsg(category, msg, chalk.cyan));
};

log.warn = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('warn', getMsg(category, msg, chalk.yellow));
};

log.error = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  args = args.map(function(arg) {
    if (arg.message) {
      return arg.message;
    } else if (arg.code) {
      return arg.code;
    } else {
      return arg;
    }
  });
  var msg = util.format.apply(this, args);

  log.log('error', getMsg(category, msg, chalk.red));
};

log.config = function(options) {
  if (options.verbose) {
    log.level = 'debug';
  }
  if (options.quiet) {
    log.level = 'warn';
  }
  chalk.enabled = options.color !== false;
};


function getMsg(category, msg, fn) {
  var len = Math.max(0, log.width - category.length);
  var pad = new Array(len + 1).join(' ');
  msg = msg.replace(process.cwd(), '$CWD')
           .replace(process.env.HOME, '~');
  if (~msg.indexOf('\x1b[')) {
    msg = pad + fn(category) + ': ' + msg;
  } else {
    msg = pad + fn(category) + ': ' + msg;
  }
  return msg;
}
