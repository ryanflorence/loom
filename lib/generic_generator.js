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
 */

exports.before = function(env, callback) {
  callback();
};

/*
 * The object returned becomes the object sent to the templating engine.
 *
 * This default method works for commands like:
 *
 *   `generate model user name:string age:number`
 *   `generate <generator> <objectName> <params>`
 *
 * @param {String} objectName
 * @param {Object} params
 * @param {Object} env - loom environment
 * @param {Function} callback
 */

exports.present = function(objectName, params, env, callback) {
  callback({
    objectName: objectName,
    params: params
  });
};

/*
 * Returns template(s) for the the program to use. Can also define
 * `exports.templates` to be used instead, in which case return an array.
 *
 * @params {Object} env - loom environment
 */

exports.template = function(env, callback) {
  var ext = env.name.match(/(\.([^/.]+)){2}$/);
  var template = ext ? env.name : env.name+'.hbs';
  callback(template);
};

/*
 * Renders a template with a loom template engine
 *
 * @param {Function} engine
 * @param {String} templatePath
 * @param {Object} locals
 */

exports.render = function(engine, templatePath, locals, callback) {
  fs.readFile(templatePath, function(error, data) {
    if (error) throw new Error(error);
    engine(data.toString(), locals, function(src) {
      callback(src);
    });
  })
};

/*
 * Writes rendered templates to the files system.
 */

exports.write = function(savePath, src, env, callback) {
  fs.confirmWriteFile(savePath, src, callback);
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
 * @param {String} template - the template name
 * @param {String} src - the rendered template source
 * @param {Object} env - the loom environment
 */

exports.savePath = function(template, env, callback) {
  var basename = path.basename(template);
  var name = env.args[0];
  var filename = basename.replace(env.name, name).replace(/\.[^/.]+$/, "");
  callback(path.dirname(template)+'/'+filename);
};

