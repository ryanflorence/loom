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
  // yes, this is what asynchronous file operations look like, I plead with
  // nodesters everywhere to make this as simple as the sync version at
  // 00bcc690f45b39834557e9b6154e131c2de0cef9, consider it a pull request request.
  var env = program.loom;
  mergeGenerator(env, function(generator) {
    generator.before(function() {
      generator.present(function(locals) {
        getTemplates(generator, env, function(templates) {
          env.out = '';
          templates.forEach(function(template, index, arr) {
            findTemplate(template, env, function(path) {
              msg.assert('No template found for '+template, path);
              var engine = requireEngine(template, env);
              generator.render(function(src) {
                env.out += src;
                if (!program.stdout) {
                  generator.savePath(function(savePath) {
                    generator.write(function() {
                      if (index == arr.length - 1) {
                        callback(env);
                      }
                    }, env, savePath, src);
                  }, env, template);
                } else if (index == arr.length - 1) {
                  callback(env);
                }
              }, env, engine, path, locals);
            });
          });
        });
      }, env);
    }, env);
  });
};

