var commander = require('commander');
var fs = require('./lib/fs');
var version = JSON.parse(fs.readFileSync(__dirname+'/package.json')).version;

module.exports = function(argv, callback) {
  if (argv !== process.argv) {
    argv = argv.split(' ');
    argv.unshift('', '');
  }

  var program = new commander.Command();

  require('./lib/commands/init')(program);
  require('./lib/commands/generate')(program, callback);
  require('./lib/commands/boilerplate')(program, callback);

  program.parse(argv);
};

