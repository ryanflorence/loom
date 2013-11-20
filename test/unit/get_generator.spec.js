var getGenerator = require('../../lib/get_generator');
var fixture = require('../support/fixture');

describe('get_generator', function() {
  it('gets a generator from an env.path by name', function(done) {
    var expected = require(fixture('one/generators/model'));
    getGenerator('test/fixtures/one', 'model', function(generator) {
      generator.should.equal(expected);
      done();
    });
  });

  it('gets a default generator if there is one and name matches nothing', function(done) {
    var expected = require(fixture('one/generators/default'));
    getGenerator('test/fixtures/one', 'nomatch', function(generator) {
      generator.should.equal(expected);
      done();
    });
  });

  it('gets generic_generator if there are no generators found', function(done) {
    var expected = require('../../lib/generic_generator');
    getGenerator('test/fixtures/three', 'nomatch', function(generator) {
      generator.should.equal(expected);
      done();
    });
  });

  it('merges matched generators with generic_generator', function(done) {
    getGenerator('test/fixtures/one', 'model', function(generator) {
      generator.should.have.property('before');
      generator.should.have.property('present');
      generator.should.have.property('render');
      generator.should.have.property('templates');
      generator.should.have.property('template');
      generator.should.have.property('write');
      done();
    });
  });

});


