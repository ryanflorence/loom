var msg = require('./message');
var tryRequire = require('./try_require');

/*
 * Finds the template engine from the loom env paths based on the extension of
 * the template. For example, foo.hbs would look for engines/hbs.js and if not
 * found in the paths will then look for it with `require('loom-engine-hbs')`.
 */

module.exports = function (template, env) {
  var ext = template.match(/\.([^/.]+)$/, "");
  msg.assert("templates must have an extension, no extension found for "+template, ext);
  var type = ext[1];
  var local, engine;
  for (var i = 0; i < env.paths.length; i += 1) {
    local = process.cwd()+'/'+env.paths[i]+'/engines/'+type;
    engine = tryRequire(local);
    if (engine) {
      return engine;
    }
  }
  return tryRequire('loom-engine-'+type);
};

