var findGenerator = require('../../lib/find_generator');
var fixture = require('../support/fixture');

describe('find_generator', function() {
  it('finds first generator on env.paths', function() {
    var generator = require(fixture('generators/model'));
    var env = { paths: ['test/fixtures', 'fake/stuff'], name: 'model' };
    findGenerator(env).should.equal(generator);
  });

  it('finds the first default generator on env.paths', function() {
    var generator = require(fixture('generators/default'));
    var env = { paths: ['test/fixtures', 'fake/stuff'], name: 'unnamed' };
    findGenerator(env).should.equal(generator);
  });
});

