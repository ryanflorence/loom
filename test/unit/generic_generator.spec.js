var generator = require('../../lib/generic_generator');
var fs = require(__dirname+'/../../lib/fs');
var sinon = require('sinon');
var fixture = require('../support/fixture');
var engine = require('../fixtures/engines/noop');

describe('generic_generator', function() {

  describe('present', function() {
    it('returns locals like this:', function() {
      generator.present('user', {name: 'string'}, {}).should.eql({
        objectName: 'user',
        params: { name: 'string' }
      });
    });

    it('skips everything inbetween the name and options', function() {
      generator.present('user', 'skip', 'this', {name: 'string'}, {}).should.eql({
        objectName: 'user',
        params: { name: 'string' }
      });
    });
  });

  describe('render', function() {
    it('renders a template', function() {
      var template = fixture('templates/app/model.js.hbs');
      var src = fs.readFileSync(template).toString();
      var locals = {foo: 'bar'};
      generator.render(engine, template, locals).should.eql({
        src: src,
        locals: locals
      });
    });
  });

  describe('template', function() {
    it('returns the name with handlebars as a default when no second extension is provided', function() {
      generator.template({name: 'foo.js'}).should.eql('foo.js.hbs');
    });

    it('returns the template name when extension is provided', function() {
      generator.template({name: 'foo.js.whack'}).should.eql('foo.js.whack');
    });
  });

  describe('savePath', function() {
    it('transforms the template path to a sane save path', function() {
      var env = {name: 'model', args: ['user']};
      var path = generator.savePath('path/to/model.js.hbs', env);
      path.should.equal('path/to/user.js');
    });
  });

  describe('write', function() {
    it('writes a template', function() {
      var mock = sinon.mock(fs);
      mock.expects('confirmWriteFileSync').withArgs('path/to/user.js', 'source');
      var env = {name: 'model', args: ['user']};
      generator.write('path/to/user.js', 'source', env);
      mock.verify();
      mock.restore();
    });
  });
});

