/*
 * gets a value from a value or function
 */

module.exports = function (/*prop, args...*/) {
  var prop = [].shift.call(arguments, 1);
  if ('function' == typeof prop) {
    return prop.apply(null, arguments);
  } else {
    return prop;
  }
};

