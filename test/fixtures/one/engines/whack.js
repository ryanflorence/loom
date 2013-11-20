module.exports = function(template, locals) {
  return template.replace(/%FOO%/, 'foo');
};

