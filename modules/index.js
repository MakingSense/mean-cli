/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var meanpGen = require('../app/index');

var ModuleGenerator = meanpGen.extend({
  constructor: function () {
    meanpGen.apply(this, arguments);
    this.attrs = this.arguments.map(function (attr) {
      var parts = attr.split();
      return {
        name: parts[0],
        action: parts[1]
      };
    })[0];
    var dirPath = '/templates';
    this.sourceRoot(path.join(__dirname, dirPath));
  },

  createModuleFiles: function () {
    var done = this.async();
    // Have Yeoman greet the user.
    this.log(yosay('Welcome to the meanp module generator!'));
    var prompts = [{
      name: 'moduleName',
      message: 'How would you like to name your new module?',
      default: this.attrs ? this.attrs.name : 'example'
    }];
    this.prompt(prompts, function (props) {
      this.moduleName = props.moduleName;
      done();
    }.bind(this));
  },
  afterConfirm: function(){
    var moduleDir = './public/modules/' + this.moduleName;
    //Creating directories
    this.mkdir(moduleDir);
    this.mkdir(moduleDir + '/assets');
    this.mkdir(moduleDir + '/assets/css');
    this.mkdir(moduleDir + '/controllers');
    this.mkdir(moduleDir + '/services');
    this.mkdir(moduleDir + '/views');
    //Copying files
    this.copy('./assets/css/main.css', moduleDir + '/assets/css/' + this.moduleName + '.css');
    this.copy('./controllers/main.js', moduleDir + '/controllers/' + this.moduleName + '.js');
    this.copy('./services/factory.js', moduleDir + '/services/' + this.moduleName + '.js');
    this.copy('./views/main.html', moduleDir + '/views/' + this.moduleName + '.html');
    this.copy('package.json', moduleDir + '/package.json');
    this.copy('app.js', moduleDir + '/app.js');
    //Generating js references TODO
  }
});

module.exports = ModuleGenerator;
