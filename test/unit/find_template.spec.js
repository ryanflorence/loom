var findTemplate = require('../../lib/find_template');
var fixture = require('../support/fixture');

describe('find_template', function() {
  it('finds a template', function() {
    var env = { paths: ['test/fixtures', 'fake/stuff'] };
    var expected = 'test/fixtures/templates/app/model.js.hbs';
    findTemplate('app/model.js.hbs', env).should.equal(expected);
  });

  it('returns false if no template is found', function() {
    var env = { paths: ['test/fixtures', 'fake/stuff'] };
    findTemplate('fake.js.hbs', env).should.be.false;
  });
});

