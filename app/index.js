'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var clone = require("nodegit").Repo.clone;
var sys = require('sys')
var exec = require('child_process').exec;

var MeanpGenerator = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');

    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies();
      }
    });
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the meanp app generator!'));
    var prompts = [{
      name: 'appName',
      message: 'How would you like to name your application?',
      default: this.arguments.length > 0 ? this.arguments[0] : 'meanp'
    }];

    this.prompt(prompts, function (props) {
      this.appName = props.appName;
      done();
    }.bind(this));
  },

  app: function () {
    // Creates project folder
    this.mkdir(this.appName);
    // Clone a given repository into a specific folder.
    function puts(error, stdout, stderr) { sys.puts(stdout) }
    exec("git clone git://github.com/MakingSense/meanp-seed.git " + this.appName, puts);
    exec('cd ' + this.appName, puts);
  }
});

module.exports = MeanpGenerator;
