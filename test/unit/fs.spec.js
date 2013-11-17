var sinon = require('sinon');
var fs = require('../../lib/fs');
var msg = require('../../lib/message');
var tmp = require('../support/tmp_dir');

msg.silence();

describe('fs', function() {
  var stub;

  beforeEach(function(next) {
    stub = sinon.stub(msg, 'confirm', function(question, callback) {
      callback(true);
    });
    tmp.create(next);
  });

  afterEach(function(next) {
    stub.restore();
    tmp.remove(next);
  });

  describe('confirmWriteFileSync', function() {
    it("writes files that don't exists", function(done) {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFile(path, 'bar', function(err) {
        fs.existsSync(path).should.equal(true);
        fs.readFileSync(path).toString().should.equal('bar');
        done();
      });
    });

    it("doesn't write files that exist when users says no", function(done) {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFile(path, 'bar', function() {
        fs.existsSync(path).should.equal(true);
        stub.restore();
        stub = sinon.stub(msg, 'confirm', function(question, callback) {
          callback(false);
        });
        fs.readFileSync(path).toString().should.equal('bar');
        fs.confirmWriteFile(path, 'baz', function() {
          fs.readFileSync(path).toString().should.equal('bar');
          done();
        });
      });
    });

    it("overwrites files that exist when users says yes", function(done) {
      var path = tmp.path+'/foo.txt';
      fs.confirmWriteFile(path, 'bar', function() {
        fs.existsSync(path).should.equal(true);
        fs.readFileSync(path).toString().should.equal('bar');
        fs.confirmWriteFile(path, 'baz', function() {
          fs.readFileSync(path).toString().should.equal('baz');
          done();
        });
      });
    });
  });
});
