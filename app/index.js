'use strict';
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var sys = require('sys')
var exec = require('child_process').exec;
var meanp;
function puts(error, stdout, stderr) { sys.puts(stdout) }

var MeanpGenerator = yeoman.generators.Base.extend({
  init: function () {
    meanp = this;
    this.pkg = require('../package.json');
    this.on('end', function () {
      if (!this.options['skip-install']) {
        this.installDependencies({
          npm: true,
          bower: true,
          skipInstall: false,
          callback: function(){
            setTimeout(function(){
              exec("grunt " + meanp.appName + "/server", puts);
            }, 5000);
          }
        });
      }
    });
  },
  askFor: function () {
    var done = this.async();
    this.log(yosay('Welcome to the meanp app generator!'));
    var prompts = [{
      name: 'appName',
      message: 'How would you like to name your application?',
      default: this.arguments.length > 0 ? this.arguments[0] : 'meanp'
    }];

    this.prompt(prompts, function (props) {
      if(!props.appName) { props.appName = 'meanp' };
      this.appName = props.appName;
      exec("git clone git://github.com/MakingSense/meanp-seed.git " + props.appName, function(err, stdout, stderr){
        if(err){ 
          console.log('The folder already exists and is not empty');
          return;
        };
        console.log(stderr);
        meanp.destinationRoot(meanp.appName);
        done();
      });
    }.bind(this));
  }
});

module.exports = MeanpGenerator;
