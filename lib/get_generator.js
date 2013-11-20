var fs = require('./fs');
var path = require('path');
var genericGenerator = require('./generic_generator');

module.exports = function(genPath, name, callback) {
  var relativePath = path.relative(process.cwd(), genPath+'/generators');
  var basePath = path.resolve(relativePath);
  var generatorPath = basePath+'/'+name+'.js';
  var defaultPath = basePath+'/default.js';
  fs.exists(generatorPath, function(exists) {
    if (exists) {
      return callback(merge(require(generatorPath)));
    }
    fs.exists(defaultPath, function(exists) {
      if (exists) {
        return callback(merge(require(defaultPath)));
      }
      callback(genericGenerator);
    });
  });
};

function merge(generator) {
  for (var method in genericGenerator) {
    if (generator[method]) continue;
    generator[method] = genericGenerator[method];
  }
  return generator;
}

