var c = 0
function equal (a, b, msg){
  c++
  console.assert(a === b, msg + '\n==> Expected', b, 'got', a, "\n")
}

var loom = require('../src/loom.js')
// can move the methods as Object functions, if you're hard-core.
loom.merge(Object, loom.noConflict())

var obj = {
  foo: function (){
    return 'foo'
  },
  add: function (x, y){
    return x + y;
  }
}

var obj2 = {
  foo: function (){
    return 'foo2'
  },
  bar: function (){
    return 'bar'
  }
}

var obj3 = {
  baz: function (){
    return 'baz'
  }
}

var obj4 = {
  fn: function (){
    return 'foo'
  }
}

// tests
Object.append(obj, obj2)
equal(obj.foo(), 'foo', "append shouldn't overwrite props  already exist")
equal(obj.bar(), 'bar', "append should add properties that don't exist")

Object.merge(obj, obj2, obj3);
equal(obj.foo(), 'foo2', "merge should overwrite props that exist")
equal(obj.baz(), 'baz', "merge should accept multiple args")

Object.punch(obj, 'add', function (old, x, y, z){
  return old(x, y) + z
})
var r = obj.add(1,2,3)
equal(r, 6, 'should call the old function')


// construct tests
var obj = {
  inheritedProp: 'foo',
  overwrittenProp: 'foo',
  inherited: function (){
    return 'foo'
  },
  punched: function (x, y){
    return x + y
  }
}

var newObj = Object.construct(obj, {
  newProp: 'bar',
  overwrittenProp: 'bar',
  punched: function (old, x, y){
    return old(x, y) * 2
  },
  newFn: function (){
    return 'foo'
  }
}, [obj2, obj3])

equal(newObj.newProp, 'bar', 'construct should add new properties')
equal(newObj.overwrittenProp, 'bar', 'construct should overwrite existing properties')
equal(newObj.inheritedProp, 'foo', 'construct should inherit properties')

equal(newObj.newFn(), 'foo', 'construct should add new methods')
equal(newObj.punched(2,3), 10, 'construct should punch existing methods')
equal(newObj.inherited(), 'foo', 'construct should inherit methods')

equal(newObj.foo(), 'foo2', 'construct should append mixins')
equal(newObj.baz(), 'baz', 'construct should append mixins')

console.log('Passed all', c, 'tests')