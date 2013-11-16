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

module.exports = function(program, callback) {
  var env = program.loom;
  mergeGenerator(env, function(generator) {
    generator.before(env, function() {
      generator.present.apply(null, env.args.concat([env.params, env, function(locals) {
        getTemplates(generator, env, function(templates) {
          var out = '';
          templates.forEach(function(template, index, arr) {
            findTemplate(template, env, function(path) {
              msg.assert('No template found for '+template, path);
              var engine = requireEngine(template, env);
              generator.render(engine, path, locals, function(src) {
                out += src;
                if (!program.stdout) {
                  generator.savePath(template, env, function(savePath) {
                    generator.write(savePath, src, env, function() {
                      if (index == arr.length - 1) {
                        env.out = out;
                        callback(env);
                      }
                    });
                  });
                }
              });
            });
          });
        });
      }]));
    });
  });
};

