require('should');
var log = require('./');
var chalk = require('chalk');
var sinon = require('sinon');

describe('log', function() {

  afterEach(function() {
    log.level = 'info';
  });

  it('config level', function() {
    log.level.should.eql('info');
    log.config({ verbose: true });
    log.level.should.eql('debug');
    log.config({ quiet: true });
    log.level.should.eql('warn');
  });

  it('config color', function() {
    chalk.enabled.should.eql(true);
    log.config({ color: false });
    chalk.enabled.should.eql(false);
    log.config({ color: { debug: 'white' } });
    chalk.enabled.should.eql(true);
  });

  it('default level', function() {
    var old_console_warn = console.warn;
    var old_console_error = console.error;
    console.warn = function() {
      console.warn = old_console_warn;
    };
    console.error = function() {
      console.error = old_console_error;
    };
    var console_log = sinon.spy(console, 'log');
    var console_info = sinon.spy(console, 'info');
    var console_warn = sinon.spy(console, 'warn');
    var console_error = sinon.spy(console, 'error');

    log.config({ color: false });

    log.debug('debug', 'debug');
    console_log.callCount.should.eql(0);
    log.info('info', 'info');
    console_info.callCount.should.eql(1);
    console_info.calledWith('           info: info').should.eql(true);
    log.warn('warn', 'warn');
    console_warn.callCount.should.eql(1);
    log.error('error', 'error');
    console_error.callCount.should.eql(1);

    log.config({ color: true });
  });

});

