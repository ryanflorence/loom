var requireEngine = require('../../lib/require_engine');

describe('requireEngine', function() {
  it('requires an engine from env.paths', function() {
    var engine = require('../fixtures/one/engines/noop');
    var env = { paths: ['test/fixtures/one'] };
    var template = 'app/model.js.noop';
    requireEngine(template, env).should.equal(engine);
  });

  it('requires an engine from installed node_modules', function() {
    var engine = require('loom-engine-hbs');
    var env = { paths: ['test/fixtures'] };
    var template = 'app/model.js.hbs';
    requireEngine(template, env).should.equal(engine);
  });

});

