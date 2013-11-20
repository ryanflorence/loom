var run = require('../../lib/runner');

describe('runner', function(){
  it('generates templates', function(done) {
    var program = {
      stdout: true,
      loom: {
        args: ['user'],
        name: 'model',
        paths: ['test/fixtures/one'],
        params: { name: 'string' }
      }
    };
    run(program, function(env) {
      env.should.equal(program.loom);
      env.out.should.match(/user string/);
      env.out.should.match(/user spec/);
      done();
    });
  });

  it('generates templates for all matching paths', function(done) {
    var program = {
      stdout: true,
      loom: {
        args: ['user'],
        name: 'model',
        paths: ['test/fixtures/one', 'test/fixtures/three'],
        params: { name: 'string' }
      }
    };
    run(program, function(env) {
      env.should.equal(program.loom);
      env.out.should.match(/user string/);
      env.out.should.match(/user spec/);
      env.out.should.match(/user other/);
      done();
    });
  });

});

