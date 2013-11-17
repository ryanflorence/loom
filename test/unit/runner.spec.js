var run = require('../../lib/runner');

describe('runner', function(){
  it('generates templates', function(done) {
    var program = {
      stdout: true,
      loom: {
        args: ['user'],
        name: 'model',
        paths: ['test/fixtures'],
        params: { name: 'string' }
      }
    };
    run(program, function(env) {
      env.should.equal(program.loom);
      env.out.should.equal('user string\nuser spec\n');
      done();
    });
  });
});

