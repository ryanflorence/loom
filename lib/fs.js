var fs = require('fs-extra');
var msg = require('./message');

module.exports = fs;

/*
 * writes a file unless it exists, then asks the user
 */

fs.confirmWriteFileSync = function(fileName, data, force) {
  if (force != 'force' && fs.existsSync(fileName)) {
    if (!msg.confirm(fileName+' exists, overwrite?')) {
      return msg.fileSkipped(fileName);
    }
  }
  fs.createFileSync(fileName);
  fs.writeFileSync(fileName, data);
  return msg.fileCreated(fileName);
};

fs.mkdirpUnlessExistsSync = function(path) {
  var result = fs.mkdirpSync(path);
  if (result) {
    msg.fileCreated(path);
  } else {
    msg.fileExists(path);
  }
};

