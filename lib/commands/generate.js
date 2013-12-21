module.exports = function(program, callback) {

  var generate = program.command('generate');

  generate.description('generates a template')

  generate.option(
    '-p, --path [path]',
    'path of directory containing generators'
  );

  generate.option(
    '-s, --stdout',
    'print result to stdout only'
  );

  generate.option(
    '-q, --quiet',
    'log nothing, even if --stdout is used'
  );

  generate.option(
    '--init',
    'creates loom directories to hold your generators'
  );

  /*
   * It all starts with a string, get it?
   *
   * You can call loom directly by passing it the string you would have
   * used via command line. For example:
   *
   *   loom('model user name:string age:number');
   */

  generate.action(function() {
    var parse = require('../parser');
    var msg = require('../message');
    var run = require('../runner');

    parse(program);

    if (program.quiet) {
      msg.silence();
    }

    run(program, function(env) {
      if (program.stdout) {
        msg.notify(program.loom.out);
      }
      if (callback) { callback(env) };
    });
  });
};

