var fs = require('./fs');
var path = require('path');

/*
 * looks for the first generator found in generator paths
 */

module.exports = function(env, callback) {
  var paths = env.paths.slice(0, env.paths.length);
  find(paths.shift());

  function find(genPath) {
    var relativePath = path.relative(process.cwd(), genPath+'/generators');
    var basePath = path.resolve(relativePath);
    var generatorPath = basePath+'/'+env.name+'.js';
    var defaultPath = basePath+'/default.js';
    fs.exists(generatorPath, function(exists) {
      if (exists) {
        callback(require(generatorPath), generatorPath);
      } else {
        fs.exists(defaultPath, function(exists) {
          if (exists) {
            callback(require(defaultPath), defaultPath);
          } else if (paths.length == 0) {
            callback(false);
          } else {
            find(paths.shift());
          }
        });
      }
    });
  }
};

