LoomJS
======

Weave the object fabric of your app together with methods for constructing, merging, appending, and mutating objects and their methods.

LoomJS is a simple and powerful four method API for differential inheritance and AOP. (Mostly taken from [SnackJS][snack].)

Environments & Installation
---------------------------

### Node

Install with npm:

```bash
$ npm install loom
```

Require like anything else:

```javascript
var loom = require('loom')
```

### Ender - Client-Side

Integrates with [Ender][ender].  When building with Ender, the global `loom` object is returned to its rightful owner and the methods are assigned to the Ender global (usually `$`).  So `loom.punch` becomes `$.punch`.

```bash
$ ender build loom
```

### Client-Side

You can simply include `src/loom.js` into your web page.

License & Copyright
-------------------

(c) Ryan Florence, MIT License










API
===





loom.punch
----------

Mutates an object method (duck punching, AOP) or simply connects one function to another.

### Signature

```javascript
loom.punch(obj, method, fn [, auto])
```

### Arguments

1.	`obj` (<b>object</b>) - The object who's method is getting punched.
2.	`method` (<b>string</b>) - The name of the object's method.
3.	`fn` (<b>function</b>) - The new function.
	__Signature__
	`function ([old [, argN]])`

	__Arguments__
	1. `old` (__function__) - The old version of the method, (with context already bound to the object). <b>Note:</b> This argument is passed by default, if the `auto` argument is used then this argument will not be passed
	2. `argN` (__mixed__) - Any arguments passed when the method is called.

4.	`auto` (__boolean__: optional, defaults to false) - If true, will automatically call the old method before calling the new one.

### Returns
Undefined

### Examples

```javascript
var widget = {
  a: 0,
  b: 0,
  add: function (amt){
    this.a += amt
  }
}

widget.add(1)
widget.a //> 1
widget.b //> 0

loom.punch(widget, 'add', function (old, amt){
  // old is the old version of this method, already bound to widget
  // call it wherever you want inside of here
  old(amt)
  this.b += amt
})

widget.add(1)
widget.a //> 2
widget.b //> 1

loom.punch(widget, 'add', function (){
  // the last arg (`auto`) is `true`, so old will be called before
  // this stuff happens.  Effectively the same as calling `old`
  // on the first line of this new function.
  console.log("I'm adding stuff!")
}, true)

widget.add(1) // console logs "I'm adding stuff!"
widget.a //> 3
widget.b //> 2

loom.punch(widget, 'add', function (old){
  return this.a + this.b
  // since `auto` is not true, and old is not called
  // this method has been completely overwritten
})

var res = widget.add()
res //> 5
widget.a //> 3 ... unchanged
widget.b //> 2 ... unchanged
```

### Notes

When using the `auto` argument, this is extremely similar to `dojo.connect` (minus the DOM events).  It's also not unlike `Extends` and `this.parent` in a MooTools class.  Think of the `old` argument as `this.parent`.





loom.construct
--------------

Similar to Object.create, in that it sets the prototype of an object to another.  It also allows for an extension object to merge into the new object. When methods are redefined in the extension object, they are automatically `punched` providing a reference to the old (or parent) method. Useful for object templating and prototypal inheritance.

### Signature

```javascript
loom.construct(proto [, ext [, mixins]])
```

### Arguments

1. `proto` (__object__) - The object use as the prototype.
2. `ext` (__object__: optional) - An object to merge into the new object. <b>Note:</b> if a method is redefined then it will be automatically `punched`, providing as the first argument of the method the old method.  Please see the examples.
3. `mixins` (__array__: optional) - An array of objects to `append` to the new object.

### Returns

Object - A new object with `proto` as its prototype, `ext` merged into it, and `mixins` appended to it.

```javascript
// construct a generic object
var point = {
  coords: {
    x: 0,
    y: 0
  },

  translate: function (x, y){
    this.coords.x += x
    this.coords.y += y
  },

  sum: function (){
    var sum = 0
    for (key in this.coords)
      sum += this.coords[key]
    return sum
  }
}

// construct a generic object that inherits from the other
var point3d = loom.construct(point, {
  // new property
  z: 0,
  // redefined method
  translate: function (old, x, y, z){
    // if a method exists in the prototype object
    // then the method here is automatically punched
    // providing the old method as the first argument
    old()
    this.coords.z += z
  }
})

// construct objects that inherit from the generic objects (instances, if you will)
var p = loom.construct(point)
p.translate(5,10)
p.coords.x //> 5
p.coords.y //> 10
p.sum() //> 15
p.__proto__ === point //> true

var p3d = loom.construct(point3d)
p3d.translate(1,2,3) // punched method, note that the signature does not
                     // include the `old` argument when being called
p.coords //> {x: 1, y: 2, z: 3}
p.sum() //> 6, inherited
p3d.__proto__ === point3d //> true
```





loom.merge
----------

Merges one or more objects into the first, overwriting previous properties.

### Signature

```javascript
loom.merge(target, obj [, objN...])
```

### Arguments

1. `target` (__object__) - The object to receive new properties.
2. `obj` (__object__) - The object to merge into the first.
3. `objN` (__object__) - Additional objects to merge into the first, each one overwriting the properties of the previous.

### Returns

Object - The target `obj`, with the other objects merged into it.

### Examples

```javascript
var coords = {
  x: 1,
  y: 1
}

loom.merge(coords, {
  translateY: function (amt){
    this.y += amt
  },
  translateX: function (amt){
    this.x += amt
  }
})

coords.translateY(10);
coords.y //> 11
```





loom.append
-----------

Appends the properties of one object onto another, ignoring properties that already exist.

### Signature

```javascript
loom.append(obj, ext)
```

### Arguments

1. `obj` (__object__) - The object to receive new properties.
2. `ext` (__object__) - The object to append to the first.

### Returns

Object - the `obj`, with new properties.

### Examples

```javascript
var obj1 = {
	a: 'foo'
}

var obj2 = {
	a: 'exists already',
	b: 'bar',
	c: 'baz'
}

loom.append(obj1, obj2)
obj1.a //> 'foo', unchanged since it exists
obj1.b //> 'bar', appended because it didn't exist
```





loom.noConflict
---------------

Returns the `loom` to it's previous definition and returns a loom object.

### Signature

```javascript
loom.noConflict()
```

### Returns

Object - a `loom` object.

### Examples

_Assigning to a new object_

```javascript
var loom = 'foo'

// pretend like loom.js is included here

typeof loom //> object

var o = loom.noConflict()

loom //> 'foo' back to its rightful owner
o //> new reference for loom
```

_Assigning to global Object_

Some like to put things in places that make semantic sense.

```javascript
loom.merge(Object, loom.noConflict())
// loom is gone
Object.punch //> function
Object.append //> function, etc.
```

[snack]:http://snackjs.com
[ender]:http://ender.no.de