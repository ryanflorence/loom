var run = require('../../lib/runner');

describe('runner', function(){
  it('generates templates', function() {
    var program = {
      stdout: true,
      loom: {
        args: ['user'],
        name: 'model',
        paths: ['test/fixtures'],
        params: { name: 'string' }
      }
    };
    run(program);
    program.loom.out.should.equal('user string\nuser spec\n');
  });
});

