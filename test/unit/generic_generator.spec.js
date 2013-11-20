var generator = require('../../lib/generic_generator');
var fs = require(__dirname+'/../../lib/fs');
var sinon = require('sinon');
var fixture = require('../support/fixture');
var engine = require('../fixtures/one/engines/noop');

describe('generic_generator', function() {

  describe('present', function() {
    it('returns locals like this:', function(done) {
      var env = {name: 'model', args: ['user'], params: {name: 'string'}};
      generator.present(function(locals) {
        locals.should.eql({
          objectName: 'user',
          params: { name: 'string' }
        });
        done();
      }, env);
    });
  });

  describe('render', function() {
    it('renders a template', function(done) {
      var template = fixture('one/templates/app/model.js.hbs');
      var src = fs.readFileSync(template).toString();
      var locals = {foo: 'bar'};
      generator.render(function(output) {
        output.should.eql({
          src: src,
          locals: locals
        });
        done();
      }, {}, engine, template, locals);
    });
  });

  describe('template', function(done) {
    it('returns the name with handlebars as a default when no second extension is provided', function(done) {
      generator.template(function(output) {
        output.should.eql('foo.js.hbs');
        done();
      }, {name: 'foo.js'});
    });

    it('returns the template name when extension is provided', function(done) {
      generator.template(function(output) {
        output.should.eql('foo.js.whack');
        done();
      }, {name: 'foo.js.whack'});
    });
  });

  describe('savePath', function() {
    it('transforms the template path to a sane save path', function(done) {
      var env = {name: 'model', args: ['user']};
      generator.savePath(function(path) {
        path.should.equal('path/to/user.js');
        done();
      }, env, 'path/to/model.js.hbs');
    });
  });

  describe('write', function() {
    it('writes a template', function() {
      var mock = sinon.mock(fs);
      var noop = function(){};
      mock.expects('confirmWriteFile').withArgs('path/to/user.js', 'source');
      var env = {name: 'model', args: ['user']};
      generator.write(noop, env, 'path/to/user.js', 'source');
      mock.verify();
      mock.restore();
    });
  });
});

