/*
 * Generator used to fill in missing methods from custom generators, or serves
 * as the generator when none is provided otherwise.
 *
 * All methods are expected to be overridden by your own generators when the
 * defaults don't fit.
 */

var fs = require('./fs');
var path = require('path');

/*
 * Hook to modify `env` before anything else runs
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 */

exports.before = function(next, env) {
  next();
};

/*
 * The object returned becomes the object sent to the templating engine.
 *
 * This default method works for commands like:
 *
 *   `generate model user name:string age:number`
 *   `generate <generator> <objectName> <params>`
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 */

exports.present = function(next, env) {
  next({
    objectName: env.args[0],
    params: env.params
  });
};

/*
 * Returns template(s) for the the program to use. Can also define
 * `exports.templates` to be used instead, in which case return an array.
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 */

exports.template = function(next, env) {
  var ext = env.name.match(/(\.([^/.]+)){2}$/);
  var template = ext ? env.name : env.name+'.hbs';
  next(template);
};

/*
 * Renders a template with a loom template engine
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 * @param {Function} engine
 * @param {String} templatePath
 * @param {Object} locals
 */

exports.render = function(next, env, engine, templatePath, locals) {
  fs.readFile(templatePath, function(error, data) {
    if (error) throw new Error(error);
    engine(data.toString(), locals, function(src) {
      next(src);
    });
  })
};

/*
 * Writes rendered templates to the files system.
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 * @param {String} savePath - where the file should be written to
 * @param {String} src - the template's source to write
 */

exports.write = function(next, env, savePath, src) {
  fs.confirmWriteFile(savePath, src, next);
};

/*
 * Determines where to save the file.  This default method assumes the
 * default `present` method along with commands like:
 *
 *   generate model user
 *   generate <generator> <objectName>
 *
 * Templates will be saved to the matching directory as their location in your
 * app for example:
 *
 * Given this command:
 *
 *   generate model user
 *
 * and a generator with a template configured at:
 *
 *   loom/templates/app/model.js.hbs
 *
 * the file will be saved to:
 *
 *   app/user.js
 *
 * @param {Function} next - callback you must call to continue
 * @param {Object} env - loom environment
 * @param {String} template - the template name
 * @param {Object} env - the loom environment
 */

exports.savePath = function(next, env, template) {
  var extRegex = /\.[^/.]+$/
  var basename = path.basename(template).replace(extRegex, '');
  var objectName = env.args[0];
  var templateName = env.name.replace(extRegex, '');
  var filename = basename.replace(templateName, objectName);
  next(path.dirname(template)+'/'+filename);
};

