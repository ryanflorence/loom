var fs = require('fs');
var msg = require('./message');
var findTemplate = require('./find_template');
var mergeGenerator = require('./merge_generator');
var getTemplates = require('./get_templates');
var requireEngine = require('./require_engine');

/*
 * Runs the program, finds all the objects, calls methods on the generator and
 * eventually sets the `out` property on the loom env.
 */

module.exports = function(program) {
  var env = program.loom;
  var generator = mergeGenerator(env);
  generator.before(env);
  var locals = generator.present.apply(null, env.args.concat([env.params, env]));
  var templates = getTemplates(generator, env);
  var out = '';
  templates.forEach(function(template) {
    var path = findTemplate(template, env);
    msg.assert('No template found for '+template, path);
    var engine = requireEngine(template, env);
    var src = generator.render(engine, path, locals);
    if (!program.stdout) {
      var savePath = generator.savePath(template, env);
      generator.write(savePath, src, env);
    }
    out += src;
  });
  env.out = out;
};

