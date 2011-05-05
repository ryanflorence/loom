/*!
 * loom.js - (c) Ryan Florence 2011
 * github.com/rpflorence/loom
 * MIT License
 */
!function (context){
  var _loom = context.loom;

  var loom = context.loom = {
    punch: function (obj, method, fn, auto){
      var old = obj[method]
      obj[method] = auto ? function (){
        old.apply(obj, arguments)
        return fn.apply(obj, arguments)
      } : function (){
        var args = [].slice.call(arguments, 0)
        args.unshift(function (){
          return old.apply(obj, arguments)
        })
        return fn.apply(obj, args)
      }
    },

    construct: function (proto, ext, mixins){
      function F (){}
      F.prototype = proto
      var obj = new F()

      if (!ext)
        return obj

      for (i in ext) {
        if (!ext.hasOwnProperty(i))
          continue

        if (!proto[i] || typeof ext[i] != 'function'){
          obj[i] = ext[i]
          continue
        }

        loom.punch(obj, i, ext[i])
      }

      if (mixins)
        for (var i = 0, l = mixins.length; i < l; i++)
          if (!obj[i])
            loom.append(obj, mixins[i])

      return obj
    },

    merge: function (){
      var target = arguments[0]

      for (var i = 1, l = arguments.length; i < l; i++)
        for (key in arguments[i])
          target[key] = arguments[i][key]

      return target
    },

    append: function (obj, ext){
      for (key in ext)
        if (ext.hasOwnProperty(key) && !obj[key])
          obj[key] = ext[key]

      return obj
    },

    noConflict: function (){
      context.loom = _loom
      return loom
    }
  };

  (typeof module !== 'undefined') && module.exports && (module.exports = loom)
}(this);
