var fs = require('fs');
var msg = require('./message');
var findTemplate = require('./find_template');
var getTemplates = require('./get_templates');
var getGenerator = require('./get_generator');
var requireEngine = require('./require_engine');
var async = require('async');

/*
 * Runs the program, finds all the objects, calls methods on the generator and
 * eventually sets the `out` property on the loom env.
 */

module.exports = function(program, callback) {
  var env = program.loom;
  env.out = '';

  msg.notify('generating from:\n  - '+env.paths.join('\n  - '));

  async.eachSeries(env.paths, runPath, function() {
    callback(env);
  });

  function runPath(envPath, next) {
    getGenerator(envPath, env.name, function(generator) {
      runGenerator(generator, envPath, next);
    });
  }

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
      async.eachSeries(templates, renderTemplate, callback);
    }

    function renderTemplate(template, next) {
      findTemplate(template, envPath, handleTemplate);

      function handleTemplate(path) {
        if (!path) {
          return msg.notify('no template found at '+envPath+'/'+template+'; skipping');
        }
        var engine = requireEngine(template, env);
        generator.render(afterRender, env, engine, path, locals);
      }

      function afterRender(src) {
        env.out += src;
        if (program.stdout) { return next(); }
        generator.savePath(function(savePath) {
          generator.write(next, env, savePath, src);
        }, env, template);
      }
    }
  }
};

