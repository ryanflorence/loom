var fs = require('fs-extra');
var dirPath = process.cwd()+'/test/tmp';

exports.create = function(cb) {
  if (fs.existsSync(dirPath)) {
    cb();
  } else {
    fs.mkdir(dirPath, cb);
  }
};

exports.remove = function(cb) {
  if (!fs.existsSync(dirPath)) {
    cb();
  } else {
    fs.remove(dirPath, cb);
  }
};

exports.path = dirPath;

