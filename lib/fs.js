var fs = require('fs-extra');
var msg = require('./message');

module.exports = fs;

/*
 * writes a file unless it exists, then asks the user
 */

fs.confirmWriteFile = function(fileName, data, callback) {
  fs.exists(fileName, function(exists) {
    if (exists) {
      msg.confirm(fileName+' exists, overwrite?', function(confirmed) {
        if (!confirmed) {
          msg.fileSkipped(fileName);
          callback(null);
        } else {
          write();
        }
      });
    } else {
      write();
    }
  });

  function write() {
    fs.createFile(fileName, function(err) {
      if (err) { callback(err); }
      fs.writeFile(fileName, data, function(err) {
        if (err) { callback(err); }
        msg.fileCreated(fileName);
        callback(null);
      });
    });
  }
};

fs.mkdirpUnlessExistsSync = function(path) {
  var result = fs.mkdirpSync(path);
  if (result) {
    msg.fileCreated(path);
  } else {
    msg.fileExists(path);
  }
};

