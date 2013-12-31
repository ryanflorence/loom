var loom = require('../../loom');
var fs = require('fs');
var rimraf = require('rimraf');

describe('loom', function(){
  beforeEach(function(done){
    rimraf('tmp', done);
  });
  it('works', function(done) {
    loom('generate -p test/fixtures/one model foo name:test', function() {
      fs.readFileSync('./tmp/foo.js').toString().trim().should.equal('foo test');
      fs.readFileSync('./tmp/foo.spec.js').toString().trim().should.equal('foo spec');
      done();
    });
  });
});


