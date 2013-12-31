var parse = require('../../lib/parser');

describe('parser', function() {
  it('parses arguments and params', function() {
    var cmd = {
      path: 'some/where',
      parent: {
        args: ['model', 'user', 'name:string', cmd]
      }
    };
    parse(cmd);
    cmd.parent.loom.should.eql({
      args: ['user'],
      name: 'model',
      paths: ['some/where'],
      params: { name: 'string' }
    });
  });
});

