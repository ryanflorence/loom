loom
====

Loom helps you develop apps faster with generators and scaffolds as
both the producer and consumer.

```sh
$ npm install -g loom
```

[[consume](#consume) | [produce](#produce)]

Consume
=======

generate and originate
----------------------

Loom has two commands: `generate` and `originate`.

`generate` is used to create new files in your app from _generators_.

`originate` creates a whole new application from some boilerplate
called an _origin_, kinda like [yeoman][yeoman].

For example, let's _originate_ an ember app; follow along, its fast.

```sh
$ loom originate ember my-app
$ cd my-app
$ open index.html
```

Now lets _generate_ an `ApplicationController`.

```sh
$ loom generate controller application
$ open app/controllers/application.js
```

Note that `my-app/package.json` simply has `loom-ember` as a dependency.
Any project can `npm install loom-ember` and then use those generators
immediately. It has nothing to do with `loom originate`.

Additionally, multiple installed generators can respond to the same
command. So, generators like `loom-ember` and `loom-ember-qunit` can
both create files when a command like `loom generate controller application`
is run: one creates the spec while the other creates the application
files.

Search npm for a list of available
[origins](https://npmjs.org/search?q=originate-) and
[generators](https://npmjs.org/search?q=loom-).

Produce
=======

Creating _origins_ and _generators_ is hopefully straightforward.

Creating Generators
-------------------

Lets say you want to create some custom generators for a private
project.

### Template-only generators

First create the `loom` directory to hold your generators and templates:

`loom init`

Create a template in `loom/templates/constructor.js.hbs` and add this
content:

```js
module.exports = {{name}};

function {{name}}() {}
```

Use it!

```sh
# loom generator <template> <name>
$ loom generate constructor.js User
```

This creates a file at `user.js` with the following content:

```js
module.exports = User;

function User() {}
```

### Custom generators

Continuing from before, now create a file at
`loom/generators/constructor.js`.

```js
exports.savePath = function(next) {
  var name = env.args[0];
  next('app/constructors/'+name+'.js');
};
```

Loom will now use the `savePath` on your generator and save the file to
`app/constructors/user.js` instead of just `user.js` like before.

Also, now that we have a custom generator the command changes:

```sh
# loom generate constructor.js user
$ loom generate constructor user
```

Without a custom generator, loom just looks for a template that
matches your command. But now loom can find your custom generator and
doesn't need the extra `.js` clue.

See also: [generator-api](#generator-api)

### Sharing generator sets on npm

1. Just like in [creating generators](#creating-generators), put your
templates and generators in `loom/`.

2. Name your package `loom-<set-name>` and publish to npm.

3. Install into a project with `npm install --save loom-<set>` or `npm
   install --save-dev loom-<set>`.

The generator set will now be available in the project.

For example, assuming the generators from [creating
generators](#creating-generators) was published to npm as `loom-foo`, we
can do the following in any project:

```sh
$ npm install --save-dev loom-foo
$ loom generator constructor user
```

### Generator composition

Loom will run any generator that matches your command. For example, if
`loom-foo` and `loom-foo-mocha` both have a `constructor.js` generator,
they will both be matched and generated.

```sh
$ npm install --save loom-foo
$ npm install --save loom-foo-mocha
$ loom generate constructor user
# loom-foo creates app/constructors/user.js
# loom-foo-mocha creates tests/constructors/user.test.js
```

Creating Origins
----------------

An _origin_ is a project scaffold that can be installed with `loom
originate <origin>`. An origin is nothing more than a loom generator
that is run automatically when users originate a new app, so creating
them is identical to [creating generators](#creating-generators).

The difference is how they are published to npm. Simply publish your
project to npm with the name `originate-<name>` and its immediately
available to be consumed with `loom originate <name>`.

Additionally, if your "main" entry in `package.json` exports a function, that
function will be called after everything else.

Looking at a live example is probably the easiest way to know how to
build your own: check out [originate-ember][originate-ember].

There's even an [origin origin][yodawg] (yo dawg) to help get you
scaffold your scaffold.

  [yodawg]:https://github.com/rpflorence/originate-origin
  [originate-ember]:https://github.com/rpflorence/originate-ember

