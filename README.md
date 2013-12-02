Loom
====

Weave your wefts betwixt the warps of loom generators and scaffolds.

![wefts and warps](http://ryanflorence.com/gifs/warp-weft.gif)

**Loom makes it easy to share best-practices and common patterns for app
development.**

- build a set of generators for public consumption based on some
  framework or library (like ember, angular, backbone, etc.)
- consume those sets of generators
- override those generators
- build your own generators for your specific app

Using Loom Generator Packages from npm
--------------------------------------

Using generator packages from npm is easy:

```sh
npm install loom-ember --save
npm install loom-ember-qunit --save
generate controller user name:string age:number
```

Then refer to the documentation for the generators you've installed.

You must install with `--save` or add the module to your package.json
instead (that's how loom knows how to use them).

If two generator sets respond to the same commands, they will both be
run, allowing authors and consumers to compose them.

Create New Project Scaffolds with `originate`
---------------------------------------------

In addition to generator sets, full project scaffolds are a simple
command away when an author publishes a project to npm with a name
matching `originate-*`.

For example:

```sh
npm install -g loom
originate ember my-new-app
```

Read more about [originate][1].

Creating Your Own Generators
----------------------------

Also, see [the full generator API below](#generator-api)

While using generators others have created for you is great, its awesome
to have a simple way to make generators for our own apps. Even if you're
using a set of generators from npm, defining your own generators will
override them.

### Installation

```sh
npm install loom -g
generate --init
```

### Templates

Initializing loom simply creates some directories in your project. After
that, all you need is a template in `./loom/templates/`:

Lets say we have a lot of "meal" objects in our app, lets make a
template for what one of these objects looks like:

_loom/templates/app/meal.js.hbs_

```mustache
function {{objectName}}() {
  this.food = '{{params.food}}';
  this.venue = '{{params.venue}}';
}
```

And then you can generate files based on the template:

```sh
generate app/meal.js lunch food:taco venue:cart
```

This will create a file at `app/lunch.js` that looks like:

```js
function lunch() {
  this.food = 'taco';
  this.venue = 'cart';
}
```

Loom, by default, will save files to your app in the same relative
location they were found in your templates directory.

### Generators

We can define a generator to make everything a little nicer. First we'll
create a `present` method that determines what data goes to the
template. Then we'll tell it where to find the template so we can
simplify the generator command.

_loom/generators/meal.js_

```js
exports.present = function(next, env) {
  var locals = env.params;
  var name = env.args[0];
  locals.constructorName = name.charAt(0).toUpperCase() + name.slice(1);
  return locals;
};

exports.template = 'app/meal.js.hbs';
```

Now our template is simpler, no more `{{params.food}}` and it
capitalizes our constructor like a proper lady or gent.

_loom/templates/meal.js.hbs_

```mustache
function {{constructorName}}() {
  this.food = '{{food}}';
  this.venue = '{{venue}}';
}
```

And finally our command is simpler, it now just matches a generator
named `meal` instead of a template found at `app/meal.js`.

`generate meal lunch food:taco venue:cart`

### Engines

The default generator uses handlebars, but we can swap it out for ejs by
creating a very simple "engine":

_loom/engines/ejs.js_

```js
var _ = require('underscore');
// module.exports = _.template
// that works, but for clarity:

module.exports = function(src, locals, callback) {
  callback(_.template(src, locals));
};
```

Rename your template to `meal.js.ejs` and edit it:

```ejs
function <%= constructorName %>() {
  this.food = '<%= food %>';
  this.venue = '<%= venue %>';
}
```

Update your generator to point to the proper template:

```js
exports.template = 'app/meal.js.ejs';
```

Loom looks at the file extension of the template (in this case `ejs`)
and then tries to find a template engine named `ejs.js`.

Now generate your newly configured template:

`generate meal lunch food:taco venue:cart`

### Multiple templates for one generator

Its very common for a generator to create several files, like unit tests
and scaffoling. Lets add a unit test template to our meal generator.

_loom/templates/test/unit/meal.spec.js.ejs_

```ejs
describe('<%= constructorName %>', function() {
  it('sets food to "<%= food %>"', function() {
    var meal = new <%= constructorName %>();
    expect(meal.food).to.equal('<%= food %>');
  });
});
```

And add the template path to your generator, note the rename from
`exports.template` to `export.templates`.

```js
exports.templates = [
  'app/meal.js.ejs',
  'test/unit/meal.spec.js.ejs'
];
```

Both templates will get the same data from `generator.present` and the
files will be saved to the same relative path in your app as they are
defined in your templates directory.

### Default Generators

If you define `loom/generators/default.js`, loom will use it when a
specific generator is not found.


Publishing Generators to npm for Everybody
------------------------------------------

Name your module `loom-<name>` (like
`loom-ember`), place generators, templates, and engines in
`./loom`, and then publish.  That's it. People can simply `npm install
loom-<name> --save` and start using them.

Publishing Template Engines to npm for Everybody
------------------------------------------------

To add support for your favorite templating engine you can either add a
file to `loom/engines` or publish a module to npm named
`loom-engine-<ext>`. Loom will attempt to require the engine if it
doesn't find it in your project.

Generator API
-------------

Loom has a generic generator that can be overridden to meet your specific
use case. Generators can export a few methods that loom will use.

Your generator can implement as many methods as you need, loom will
merge in the `generic_generator` methods that you don't provide.

Here's a generator that does nothing:

_loom/generators/noop.js_

```js
exports.before = function(){};
exports.present = function(){};
exports.savePath = function(){};
exports.write = function(){};
exports.render = function(){};
exports.template = '';
// exports.template = function(){};
// exports.templates = [];
// exports.templates = function(){};
```

Below is documentation on generator API, also, check out the [generic
generator](lib/generic_generator).

All methods share the first two arguments: `next`, and `env`.

- `next` - all methods are asynchronous, so when you're done doing what
  you need to do, call `next(val)`.
- `env` - the loom environment, it contains all sorts of information
  about the `generate` command the user ran.

### generator.before

Executes before anything else happens. Useful if you need to set or
change some things on `env` before it moves through the other methods of
your generator.

#### signature

`function(next, env)`


1. next (Function) - the callback.
2. env (Object) - the loom environment object.


### generator.present

You're probably going to want `env.args` and `env.params`.

#### signature

`function(next, env)`

#### arguments

1. next (Function) - the callback.
2. env (Object) - the loom environment object.

#### examples

Lets make a generator that logs the arguments to explore how this works.

_loom/generators/user.js_

```js
exports.present = function(next, env) {
  console.log(env);
};
```

The following are commands followed by what is logged for the arguments:

```sh
generate model user name:string age:number
{ args: ['user'], params: { name: 'string', age: 'number' } }

generate model foo bar baz qux:1 quux:2
{ args: ['foo', 'bar', 'baz' ]
  params: { qux: '1', quux: '2' } }
```

As you can see, the space separated values become the `args` and the
key:value pairs are wrapped up into the `params` argument.


### generator.template

Determines which template to render.

`exports.template` can simply be a string, or a function if you need to
compute it.

Paths are relative to the `./loom/templates` directory.

#### example

To use a template found at
`loom/templates/spec/models/model.spec.js.hbs`:

```js
exports.template = 'spec/models/model.spec.js.hbs';
exports.template = function(next) {
  // some computation
  next('spec/models/model.spec.js.hbs');
};
```

#### notes

Unless you override `generator.write` the generated file will be saved
in the mirrored location in `loom/templates`, so the example above will
be saved to `spec/models/<name>.spec.js`.

### generator.templates

Same as `template` but is an array of template paths that take
precendence over `template`. Each template will receive the same locals
returned from `present`. Can also be a function that calls back an array.

#### examples

```js
exports.templates = [
  'app/models/model.js.ejs',
  'spec/models/model.spec.js.ejs'
];

exports.templates = function(next) {
  next([
    'app/models/model.js.ejs',
    'spec/models/model.spec.js.ejs'
  ]);
};
```

### generator.savePath

Determines the path in which to save a template.

#### signature

`function(next, env, template)`

#### arguments

1. next (Function) - callback with the savePath you want
2. env (Object) - the loom environment object
3. template (String) - the path of the template being rendered

### generator.write

Writes a rendered template to the file system, its unlikely you'll want
to override this.

#### signature

`function(next, env, savePath, src)`

### generator.render

Determines how to render the template, its unlinkely you'll want to
override this.

#### signature

`function(next, env, engine, templatePath, locals)`

TODO
----

- conflict resolution when two generators want to save to the same path
- --force option to overwrite files (better for scripting so you don't
  get the prompt)

License and Copyright
---------------------

MIT Style license

(c) 2013 Ryan Florence

  [1]:https://github.com/rpflorence/originate


