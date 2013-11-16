var computed = require('./computed_property');

/*
 * gets templates from the generator from generator.templates or
 * generator.template
 */

module.exports = function (generator, env, callback) {
  if (generator.templates) {
    computed(generator.templates, env, callback);
  } else {
    computed(generator.template, env, function(template) {
      callback([template]);
    });
  }
};

