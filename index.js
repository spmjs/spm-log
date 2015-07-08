'use strict';

var util = require('util');
var chalk = require('chalk');

var log = module.exports = {};

var levels = {
  debug: 1,
  info: 2,
  warn: 3,
  error: 4
};

var colors = {
  debug: 'blue',
  info: 'cyan',
  warn: 'yellow',
  error: 'red'
};

log.quiet = false;
log.width = 15;

var SPM_LOG = process.env.SPM_LOG;
if (SPM_LOG && levels[SPM_LOG.toLowerCase()]) {
  log.level = SPM_LOG.toLowerCase();
} else {
  log.level = 'info';
}

log.log = function(level, msg) {
  if (levels[level] >= levels[log.level] && log.quiet === false) {
    if (console[level]) {
      console[level](msg);
    }
    else {
      console.log(msg);
    }
  }
};

log.debug = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('debug', getMsg(category, msg, 'debug'));
};

log.info = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('info', getMsg(category, msg, 'info'));
};

log.warn = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  var msg = util.format.apply(this, args);

  log.log('warn', getMsg(category, msg, 'warn'));
};

log.error = function() {
  var category = arguments[0];
  var args = Array.prototype.slice.call(arguments).slice(1);
  args = args.map(function(arg) {
    if (arg.message) {
      return arg.message;
    }
    if (arg.code) {
      return arg.code;
    }
    return arg;
  });
  var msg = util.format.apply(this, args);

  log.log('error', getMsg(category, msg, 'error'));
};

log.config = function(options) {
  if (options.verbose) {
    log.level = 'debug';
  }
  if (options.quiet) {
    log.level = 'warn';
  }

  var colorOption = options.color;
  if (colorOption && typeof colorOption === 'object') {
    for (var level in colorOption) {
      colors[level] = colorOption[level];
    }
  }

  chalk.enabled = colorOption !== false;
};


function getMsg(category, msg, level) {
  var len = Math.max(0, log.width - category.length);
  var pad = new Array(len + 1).join(' ');
  var fn = chalk[colors[level]];

  if (typeof fn === 'function') {
    category = fn(category);
  }

  msg = msg.replace(process.cwd(), '$CWD')
           .replace(process.env.HOME, '~');

  return pad + category + ': ' + msg;
}
