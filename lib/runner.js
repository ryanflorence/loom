var fs = require('fs');
var msg = require('./message');
var findTemplate = require('./find_template');
var getTemplates = require('./get_templates');
var getGenerator = require('./get_generator');
var requireEngine = require('./require_engine');

/*
 * Runs the program, finds all the objects, calls methods on the generator and
 * eventually sets the `out` property on the loom env.
 */

module.exports = function(program, callback) {
  var env = program.loom;
  env.out = '';

  env.paths.forEach(function(envPath, index, arr) {
    getGenerator(envPath, env.name, function(generator) {
      runGenerator(generator, envPath, maybeCallback);
      function maybeCallback() {
        if (index === arr.length - 1) {
          callback(env);
        }
      }
    });
  });

  function runGenerator(generator, envPath, callback) {
    var locals;
    generator.before(afterBefore, env);

    function afterBefore() {
      generator.present(afterPresent, env);
    }

    function afterPresent(obj) {
      locals = obj;
      getTemplates(generator, env, afterGetTemplates);
    }

    function afterGetTemplates(templates) {
      templates.forEach(renderTemplate);
    }

    function renderTemplate(template, index, arr) {
      findTemplate(template, envPath, handleTemplate);

      function handleTemplate(path) {
        msg.assert('No template found for '+template, path);
        var engine = requireEngine(template, env);
        generator.render(afterRender, env, engine, path, locals);
      }

      function afterRender(src) {
        env.out += src;
        if (program.stdout) { return maybeCallback(); }
        generator.savePath(function(savePath) {
          generator.write(maybeCallback, env, savePath, src);
        }, env, template);
      }

      function maybeCallback() {
        if (index === arr.length - 1) {
          callback(env);
        }
      }
    }
  }
};

