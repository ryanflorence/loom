var fs = require('fs');
var mergeGenerator = require('../../lib/merge_generator');
var genericGenerator = require('../../lib/generic_generator');

describe('mergeGenerator', function() {
  it('callsback genericGenerator if none is found', function(done) {
    moveDefaultGenerator();
    var env = { name: 'foo', paths: ['test/fixtures'] };
    mergeGenerator(env, function(generator) {
      generator.should.equal(genericGenerator);
      restoreDefaultGenerator();
      done();
    });
  });

  it('merges genericGenerator into the generator', function(done) {
    var env = { name: 'model', paths: ['test/fixtures'] };
    mergeGenerator(env, function(generator) {
      generator.render.should.equal(genericGenerator.render);
      done();
    });
  });
});

function moveDefaultGenerator() {
  fs.renameSync(
    __dirname+'/../fixtures/generators/default.js',
    __dirname+'/../fixtures/generators/default.js.tmp'
  );
}

function restoreDefaultGenerator() {
  fs.renameSync(
    __dirname+'/../fixtures/generators/default.js.tmp',
    __dirname+'/../fixtures/generators/default.js'
  );
}
