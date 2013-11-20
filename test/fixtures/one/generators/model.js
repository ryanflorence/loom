exports.present = function(next, env) {
  next({
    name: env.args[0],
    fields: env.params
  });
};

exports.templates = [
  'app/model.js.hbs',
  'spec/model.spec.js.hbs'
];

