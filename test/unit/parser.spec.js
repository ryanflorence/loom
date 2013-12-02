var parse = require('../../lib/parser');

describe('parser', function() {
  it('parses arguments and params', function() {
    var program = {
      path: 'some/where',
      args: ['model', 'user', 'name:string']
    };
    parse(program);
    program.loom.should.eql({
      args: ['user'],
      name: 'model',
      paths: ['some/where'],
      params: { name: 'string' }
    });
  });
});

