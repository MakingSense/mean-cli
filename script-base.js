'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var util = {};
var ScriptBase = yeoman.generators.NamedBase.extend({
  constructor: function (name) {
    yeoman.generators.NamedBase.apply(this, arguments);

    this.appname = this.config.get('appName') || path.basename(process.cwd());
    this.env.options.appPath = this.config.get('appPath') || 'app';

    this.options.coffee = this.config.get('coffee') || false;

    if (typeof this.env.options.coffee === 'undefined') {
      this.env.options.coffee = this.options.coffee;
    }

    // check if --requirejs option provided or if require is setup
    if (typeof this.env.options.requirejs === 'undefined') {
      this.option('requirejs');

      this.options.requirejs = this.config.get('includeRequireJS') || false;

      this.env.options.requirejs = this.options.requirejs;
    }

    this._.mixin({ 'classify': util.classify });
  },
  addScriptToIndex: function (script) {
    try {
      var appPath = this.env.options.appPath;
      var fullPath = path.join(appPath, 'index.html');

      rewriteFile({
        file: fullPath,
        needle: '<!-- endbuild -->',
        splicable: [
          '<script src="scripts/' + script + '.js"></script>'
        ]
      });
    } catch (e) {
      this.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
    }
  },

  setupSourceRootAndSuffix: function () {
    var sourceRoot = '/templates';
    this.scriptSuffix = '.js';

    if (this.env.options.coffee || this.options.coffee) {
      sourceRoot = '/templates/coffeescript';
      this.scriptSuffix = '.coffee';
    }

    if (this.env.options.requirejs || this.options.requirejs) {
      sourceRoot += '/requirejs';
    }

    this.sourceRoot(path.join(__dirname, sourceRoot));
  },

  writeTemplate: function (source, destination, data) {
    this.setupSourceRootAndSuffix();
    var ext = this.scriptSuffix;
    this.template(source + ext, destination + ext, data);
  },

  generateTests: function () {
    return this.config.get('testFramework') === 'mocha' && !this.config.get('includeRequireJS');
  }
});
function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, '\\$&');
}

function rewrite(args) {
  // check if splicable is already in the body text
  var re = new RegExp(args.splicable.map(function (line) {
    return '\s*' + escapeRegExp(line);
  })
  .join('\n'));

  if (re.test(args.haystack)) {
    return args.haystack;
  }

  var lines = args.haystack.split('\n');

  var otherwiseLineIndex = 0;
  lines.forEach(function (line, i) {
    if (line.indexOf(args.needle) !== -1) {
      otherwiseLineIndex = i;
    }
  });

  var spaces = 0;
  while (lines[otherwiseLineIndex].charAt(spaces) === ' ') {
    spaces += 1;
  }

  var spaceStr = '';
  while ((spaces -= 1) >= 0) {
    spaceStr += ' ';
  }

  lines.splice(otherwiseLineIndex, 0, args.splicable.map(function (line) {
    return spaceStr + line;
  }).join('\n'));

  return lines.join('\n');
}

function rewriteFile(args) {
  args.path = args.path || process.cwd();
  var fullPath = path.join(args.path, args.file);

  args.haystack = fs.readFileSync(fullPath, 'utf8');
  var body = rewrite(args);

  fs.writeFileSync(fullPath, body);
}
module.exports = ScriptBase;
