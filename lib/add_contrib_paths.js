var fs = require('fs');

/*
 * finds any loom-generators-* in package.json so an entire set of generators
 * is an npm install away :D
 */

module.exports = function (program) {
  var paths = program.loom.paths;
  var packagePath = process.cwd()+'/package.json';
  if (!fs.existsSync(packagePath)) {
    return;
  }
  var json = JSON.parse(fs.readFileSync(packagePath).toString());
  var deps = merge(json.dependencies || {}, json.devDependencies || {});
  for (var dep in deps) {
    if (dep.match(/^loom-generators/)) {
      paths.push('node_modules/'+dep+'/loom');
    }
  }
};

function merge(target, ext) {
  for (var prop in ext) {
    target[prop] = ext[prop];
  }
  return target;
}

