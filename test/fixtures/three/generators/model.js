exports.present = function(next, env) {
  next({
    name: env.args[0],
    fields: env.params
  });
};

exports.template = function(next) {
  next('app/model.js.hbs');
};

