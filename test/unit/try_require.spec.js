var tryRequire = require('../../lib/try_require');

describe('tryRequire', function() {
  it('returns false instead of throwing an error', function() {
    tryRequire('flksajf').should.be.false;
  });

  it('returns modules', function() {
    var fs = require('fs');
    tryRequire('fs').should.equal(fs);
  });
});

