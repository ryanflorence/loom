var fs = require('fs');
var path = require('path');

/*
 * finds first template found in paths
 */

module.exports = function(template, env) {
  var templatePath;
  for (var i = 0; i < env.paths.length; i += 1) {
    templatePath = path.relative(
      process.cwd(),
      env.paths[i]+'/templates/'+template
    );
    if (fs.existsSync(templatePath)) {
      return templatePath;
    }
  }
  return false;
};

