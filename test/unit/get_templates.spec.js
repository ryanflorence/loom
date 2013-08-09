var getTemplates = require('../../lib/get_templates');

describe('getTemplates', function() {
  it('gets generator.template as an array', function() {
    getTemplates({ template: 'foo' }).should.eql(['foo']);
  });

  it('gets generator.templates', function() {
    getTemplates({ templates: ['foo', 'bar'] }).should.eql(['foo', 'bar']);
  });

  it('gets generator.template function as an array', function() {
    getTemplates({
      template: function(){ return 'foo'; }
    }).should.eql(['foo']);
  });

  it('gets generator.templates function', function() {
    getTemplates({
      templates: function(){ return ['foo', 'bar']; }
    }).should.eql(['foo', 'bar']);
  });
});

