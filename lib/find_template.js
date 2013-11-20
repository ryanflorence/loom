var fs = require('fs');
var path = require('path');

module.exports = function(template, envPath, callback) {
  var templatePath = path.relative(
    process.cwd(),
    envPath+'/templates/'+template
  );
  fs.exists(templatePath, function(exists) {
    callback(exists ? templatePath : false);
  });
};

