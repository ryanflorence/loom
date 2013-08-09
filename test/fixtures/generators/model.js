exports.present = function(name, fields) {
  return {
    name: name,
    fields: fields
  };
};

exports.templates = [
  'app/model.js.hbs',
  'spec/model.spec.js.hbs'
];

