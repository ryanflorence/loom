/*
 * utilities to print messages to the user
 */

var prompt = require('cli-prompt');
var color = require('cli-color');

var green = color.green;
var yellow = color.yellow;
var blue = color.blue;
var red = color.red;
var silence = false;

exports.silence = function() {
  silence = true;
};

exports.assert = function(message, test) {
  if (test) return;
  throw new Error(message);
};

exports.error = function(message, test) {
  if (test) return;
  print(red('-> ')+message);
  process.exit();
};

exports.notify = function(message) {
  print(message);
};

exports.fileCreated = function(path) {
  print(green("   created:\t") + path);
};

exports.fileSkipped = function(path) {
  print(yellow("   skipped:\t") + path);
};

exports.fileExists = function(path) {
  print(yellow("   exists:\t") + path);
};

exports.confirm = function(question, callback) {
  exports.prompt(question+' (y/n)', function(userInput) {
    callback(userInput == 'y' || userInput == 'yes');
  });
};

exports.prompt = function(question, callback) {
  prompt(yellow('-> ')+question+': ', function(input) {
    callback(input.toLowerCase());
  });
};

function print(text) {
  if (!silence) console.log(text);
}

