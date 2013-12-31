exports.present = function(next, env) {
  next({
    name: env.args[0],
    fields: env.params
  });
};

exports.templates = [
  'tmp/model.js.hbs',
  'tmp/model.spec.js.hbs'
];

