var fs = require('fs');
var path = require('path');

/*
 * finds first template found in paths
 */

module.exports = function(template, env, callback) {
  var templatePath;
  var paths = env.paths.slice(0);
  find(paths.shift());

  function find(envPath) {
    templatePath = path.relative(
      process.cwd(),
      envPath+'/templates/'+template
    );
    fs.exists(templatePath, function(exists) {
      if (exists) {
        callback(templatePath);
      } else if (paths.length == 0) {
        callback(false);
      } else {
        find(paths.shift());
      }
    });
  }
};

