var computed = require('../../lib/computed_property');

describe('computed_property', function() {
  it('returns non-function properties', function(done) {
    computed('foo', function(val) {
      val.should.eql('foo');
      done();
    });
  });

  it("returns a function's result", function(done) {
    var foo = function(callback) { callback('foo'); };
    computed(foo, function(val) {
      val.should.eql('foo');
      done();
    });
  });
});

