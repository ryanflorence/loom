var findGenerator = require('./find_generator');
var genericGenerator = require('./generic_generator');

/*
 * Finds the generator and merges with the generic generator.
 */

module.exports = function(env) {
  var generator = findGenerator(env);
  if (generator) {
    merge(generator);
  } else {
    generator = genericGenerator;
  }
  return generator;
};

function merge(generator) {
  for (var method in genericGenerator) {
    if (generator[method]) continue;
    generator[method] = genericGenerator[method];
  }
}

