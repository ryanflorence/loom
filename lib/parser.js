var path = require('path');
var msg = require('./message');
var fs = require('./fs');
var addContribPaths = require('./add_contrib_paths');

/*
 * Parses the user input into the loom env object, this object gets passed to
 * pretty much every other function used. Understand this and you'll understand
 * everything else.
 */

module.exports = function(program) {
  program.loom = {

    /*
     * args are the space separated values in the command, for example `loom
     * model user age=number` would produce `['user']` these are args are
     * sent to generator.render
     */
    args: [],

    /*
     * params are the `foo=bar` values in the command, for example loom model
     * user name=string age=number` would produce `{name: 'string', age:
     * 'number'}`
     */
    params: {},

    /*
     * the name of the generator to use, for example `loom model user` would
     * produce `name: model`
     */
    name: null,

    // the paths loom will look in to find generators, engines, and templates
    paths: program.path ? [program.path] : []
  };
  parseArgsAndParams(program);
  shiftGeneratorName(program);
  addContribPaths(program);
};

function parseArgsAndParams(program) {
  var i, arg, split;
  for (i = 0; i < program.args.length; i += 1) {
    arg = program.args[i];
    split = arg.split(':');
    if (split.length == 2) {
      addParam(program, split);
    } else {
      addArg(program, arg);
    }
  }
}

function addParam(program, pair) {
  program.loom.params[pair[0]] = pair[1];
}

function addArg(program, arg) {
  program.loom.args.push(arg);
}

function shiftGeneratorName(program) {
  msg.assert('you must provide a generator name as the first argument', program.loom.args.length);
  program.loom.name = program.loom.args.shift();
}

