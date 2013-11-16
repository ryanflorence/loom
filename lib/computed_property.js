/*
 * gets a value from a value or function
 */

module.exports = function (/*prop, args..., callback*/) {
  var args = [].slice.call(arguments, 0);
  var prop = args.shift();
  if ('function' == typeof prop) {
    prop.apply(null, args);
  } else {
    args.pop()(prop);
  }
};

