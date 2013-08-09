var sinon = require('sinon');
var fs = require('../../lib/fs');
var msg = require('../../lib/message');
var tmp = require('../support/tmp_dir');

describe('fs', function() {
  var stub;

  beforeEach(function(next) {
    stub = sinon.stub(msg, 'confirm').returns(true);
    tmp.create(next);
  });

  afterEach(function(next) {
    stub.restore();
    tmp.remove(next);
  });

  describe('confirmWriteFileSync', function() {
    it("writes files that don't exists", function() {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFileSync(path, 'bar');
      fs.existsSync(path).should.equal(true);
      fs.readFileSync(path).toString().should.equal('bar');
    });

    it("doesn't write files that exist when users says no", function() {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFileSync(path, 'bar');
      fs.existsSync(path).should.equal(true);
      stub.returns(false);
      fs.readFileSync(path).toString().should.equal('bar');
      fs.confirmWriteFileSync(path, 'baz');
      fs.readFileSync(path).toString().should.equal('bar');
    });

    it("overwrites files that exist when users says yes", function() {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFileSync(path, 'bar');
      fs.existsSync(path).should.equal(true);
      fs.readFileSync(path).toString().should.equal('bar');
      fs.confirmWriteFileSync(path, 'baz');
      fs.readFileSync(path).toString().should.equal('baz');
    });
  });
});
