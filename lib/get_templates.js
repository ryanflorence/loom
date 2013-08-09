var computed = require('./computed_property');

/*
 * gets templates from the generator from generator.templates or
 * generator.template
 */

module.exports = function (generator, env) {
  if (generator.templates) {
    return computed(generator.templates, env);
  } else {
    return [computed(generator.template, env)];
  }
};

