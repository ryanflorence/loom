var findTemplate = require('../../lib/find_template');
var fixture = require('../support/fixture');

describe('find_template', function() {
  it('finds a template', function(done) {
    var env = { paths: ['test/fixtures', 'fake/stuff'] };
    var expected = 'test/fixtures/templates/app/model.js.hbs';
    findTemplate('app/model.js.hbs', env, function(template) {
      template.should.equal(expected);
      done();
    });
  });

  it('returns false if no template is found', function(done) {
    var env = { paths: ['test/fixtures', 'fake/stuff'] };
    findTemplate('fake.js.hbs', env, function(template) {
      template.should.be.false;
      done();
    });
  });
});

