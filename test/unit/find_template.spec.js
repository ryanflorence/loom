var findTemplate = require('../../lib/find_template');
var fixture = require('../support/fixture');

describe('find_template', function() {
  it('finds a template', function(done) {
    var expected = 'test/fixtures/one/templates/tmp/model.js.hbs';
    findTemplate('tmp/model.js.hbs', 'test/fixtures/one', function(template) {
      template.should.equal(expected);
      done();
    });
  });

  it('returns false if no template is found', function(done) {
    findTemplate('fake.js.hbs', 'test/fixtures/one', function(template) {
      template.should.be.false;
      done();
    });
  });
});

