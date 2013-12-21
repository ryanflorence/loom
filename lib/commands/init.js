var fs = require('../fs');

module.exports = function(program) {
  var init = program.command('init');
  init.description('adds the folder structure for your generate set');
  init.action(initLoom);
  return init;
};

function initLoom() {
  [
    'loom',
    'loom/generators',
    'loom/templates',
    'loom/engines'
  ].forEach(fs.mkdirpUnlessExistsSync);
}

