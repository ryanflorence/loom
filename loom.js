var program = require('commander');
var fs = require('./lib/fs');
var run = require('./lib/runner');
var parse = require('./lib/parser');
var version = JSON.parse(fs.readFileSync(__dirname+'/package.json')).version;
var msg = require('./lib/message');

program.option(
  '-p, --path [path]',
  'path of directory containing generators',
  'loom'
);

program.option(
  '-s, --stdout',
  'print result to stdout only'
);

program.option(
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

module.exports = function(argv) {
  if (argv !== process.argv) {
    argv = argv.split(' ');
    argv.unshift('', '');
  }
  program.parse(argv);
  if (program.init) {
    initLoom();
    process.exit();
  }
  parse(program);
  run(program);
  if (program.stdout) {
    console.log(program.loom.out);
  }
  return program.loom;
};

function initLoom() {
  [
    'loom',
    'loom/generators',
    'loom/templates',
    'loom/engines'
  ].forEach(fs.mkdirpUnlessExistsSync);
}
