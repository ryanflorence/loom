var getTemplates = require('../../lib/get_templates');

describe('getTemplates', function() {
  it('gets generator.template as an array', function(done) {
    getTemplates({ template: 'foo' }, {}, function(templates) {
      templates.should.eql(['foo']);
      done();
    });
  });

  it('gets generator.templates', function(done) {
    getTemplates({ templates: ['foo', 'bar'] }, {}, function(templates) {
      templates.should.eql(['foo', 'bar']);
      done();
    });
  });

  it('gets generator.template function as an array', function(done) {
    var generator = {
      template: function(next, env){
        next('foo');
      }
    };
    getTemplates(generator, {}, function(templates) {
      templates.should.eql(['foo']);
      done();
    });
  });

  it('gets generator.templates function', function(done) {
    var generator = {
      templates: function(next, env){
        next(['foo', 'bar']);
      }
    };
    getTemplates(generator, {}, function(templates) {
      templates.should.eql(['foo', 'bar']);
      done();
    });
  });
});

