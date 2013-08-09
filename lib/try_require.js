/*
 * Tries to require a module, catches errors.
 */

module.exports = function (path) {
  try {
    return require(path);
  } catch(e) {
    return false;
  }
};

