var fs = require('fs');
var mergeGenerator = require('../../lib/merge_generator');
var genericGenerator = require('../../lib/generic_generator');

describe('mergeGenerator', function() {
  it('returns genericGenerator if none is found', function() {
    moveDefaultGenerator();
    var env = { name: 'foo', paths: ['test/fixtures'] };
    mergeGenerator(env).should.equal(genericGenerator);
    restoreDefaultGenerator();
  });

  it('merges genericGenerator into the generator', function() {
    var env = { name: 'model', paths: ['test/fixtures'] };
    var generator = mergeGenerator(env);
    generator.render.should.equal(genericGenerator.render);
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
