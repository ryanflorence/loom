var findGenerator = require('../../lib/find_generator');
var fixture = require('../support/fixture');

describe('find_generator', function() {
  it('finds first generator on env.paths', function(done) {
    var generator = require(fixture('generators/model'));
    var env = { paths: ['test/fixtures', 'fake/stuff'], name: 'model' };
    findGenerator(env, function(found, gPath) {
      found.should.equal(generator);
      done();
    });
  });

  it('finds the first default generator on env.paths', function(done) {
    var generator = require(fixture('generators/default'));
    var env = { paths: ['test/fixtures', 'fake/stuff'], name: 'unnamed' };
    findGenerator(env, function(found, name) {
      found.should.equal(generator);
      done();
    });
  });
});

