var commander = require('commander');
var fs = require('./lib/fs');
var run = require('./lib/runner');
var parse = require('./lib/parser');
var version = JSON.parse(fs.readFileSync(__dirname+'/package.json')).version;
var msg = require('./lib/message');

/*
 * It all starts with a string, get it?
 *
 * You can call loom directly by passing it the string you would have
 * used via command line. For example:
 *
 *   loom('model user name:string age:number');
 */

module.exports = function(argv, callback) {
  var program = new commander.Command();

  program.option(
    '-p, --path [path]',
    'path of directory containing generators'
  );

  program.option(
    '-s, --stdout',
    'print result to stdout only'
  );

  program.option(
    '-q, --quiet',
    'log nothing, even if --stdout is used'
  );

  program.option(
    '--init',
    'creates loom directories to hold your generators'
  );

  if (argv !== process.argv) {
    argv = argv.split(' ');
    argv.unshift('', '');
  }

  program.parse(argv);

  if (program.init) {
    initLoom();
    process.exit();
  }

  if (program.quiet) {
    msg.silence();
  }

  parse(program);

  run(program, function(env) {
    if (program.stdout) {
      msg.notify(program.loom.out);
    }
    if (callback) { callback(env) };
  });
};

function initLoom() {
  [
    'loom',
    'loom/generators',
    'loom/templates',
    'loom/engines'
  ].forEach(fs.mkdirpUnlessExistsSync);
}
