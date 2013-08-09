var computed = require('../../lib/computed_property');

describe('computed_property', function() {
  it('returns non-function properties', function() {
    computed('foo').should.eql('foo');
  });

  it("returns a function's result", function() {
    var foo = function() { return 'foo'; };
    computed(foo).should.eql('foo');
  });
});

