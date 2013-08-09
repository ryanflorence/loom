var fs = require('./fs');
var path = require('path');

/*
 * looks for the first generator found in generator paths
 */

module.exports = function(env) {
  var generatorPath, basePath, relativePath;
  for (var i = 0; i < env.paths.length; i += 1) {
    relativePath = path.relative(process.cwd(), env.paths[i]+'/generators');
    basePath = path.resolve(relativePath);
    generatorPath = basePath+'/'+env.name+'.js';
    defaultPath = basePath+'/default.js';
    if (fs.existsSync(generatorPath)) {
      return require(generatorPath);
    } else if (fs.existsSync(defaultPath)) {
      return require(defaultPath);
    }
  }
  return false;
};

