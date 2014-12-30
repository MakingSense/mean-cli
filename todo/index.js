/*jshint latedef:false */
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var fs = require('fs');
var meanGen = require('../app/index');

var TodoGenerator = meanGen.extend({
  constructor: function () {
    meanGen.apply(this, arguments);
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
    this.log(yosay('This is the todo mean module generator!'));
    var prompts = [{
      name: 'moduleName',
      message: 'How would you like to name your new todo list?',
      default: this.attrs ? this.attrs.name : 'todo'
    }];
    this.prompt(prompts, function (props) {
      this.moduleName = props.moduleName;
      done();
    }.bind(this));
  },
  afterConfirm: function(){
    var base = this.dest._base;
    var src = this.src._base;
    var path = base + '/public/modules/' + this.moduleName;
    //Directory of the destination
    var directory = [ base + '/public', base + '/public/modules', path + '/controllers', path + '/services', path + '/assets', path + '/assets/css', path + '/views']
    //Files of the template
    var files = [{
      origin: src + '/myTasksCtrl.js',
      dest: path + '/controllers/' + this.moduleName + '.js',
      inject: true,
      menu: true
    }, {
      origin: src + '/Style.css',
      dest: path + '/assets/css/' + this.moduleName + '.css'
    },{
      origin: src + '/myCSS.css',
      dest: path + '/assets/css/myCSS.css'
    },{
      origin: src + '/index.html',
      dest: path + '/views/index.html'
    }];
    var baseArray = base.split('/');
    var counter = 0;
    for (counter in directory){
      this.mkdir(directory[counter]);
      var indexOfFolder = directory[counter].indexOf(baseArray[baseArray.length - 1]);
      console.log(chalk.green(directory[counter].substr(indexOfFolder) + ' directory was created'));
    };
    counter = 0;
    for(counter in files){
      var fileContent = this.readFileAsString(files[counter].origin);
      if(fileContent){
        console.log(chalk.cyan('Changed moduleName variables...'));
        fileContent = fileContent.replace(/__moduleName__/g, this.moduleName);
      }
      var indexOfFolder = files[counter].dest.indexOf(this.moduleName) + this.moduleName.length + 1;
      this.write(files[counter].dest, fileContent);
      if(files[counter].inject){
        var htmlHook = '<!-- //===== mean-cli hook =====// -->'
        var indexHtml = this.readFileAsString(base + '/public/index.html');
        var inserTag = "<script src='modules/" + this.moduleName + '/' + files[counter].dest.substr(indexOfFolder) + "'></script>";
        if (indexHtml.indexOf(inserTag) === -1) {
          fs.writeFileSync(base + '/public/index.html', indexHtml.replace(htmlHook, inserTag+'\n'+htmlHook));
        }
        if(files[counter].menu){
          var menuFile = require(base + '/api/config/menus');
          menuFile[this.moduleName] = menuFile[this.moduleName] ? menuFile[this.moduleName] : {};
          menuFile[this.moduleName].name = this.moduleName;
          menuFile[this.moduleName].path = '/' + this.moduleName ;
          fs.writeFileSync(base + '/api/config/menus.json', JSON.stringify(menuFile));
        }
      }
      console.log(chalk.green(files[counter].dest.substr(indexOfFolder) + ' file was successfully created'));
    };
    //front-end reference setUp
    var hook   = '//===== mean-cli hook =====//';
    var modulesApp   = this.readFileAsString(base + '/public/modules/app.js');
    var insert = ".when('/" + this.moduleName + "', {templateUrl: 'modules/" + this.moduleName + "/views/index.html', controller: '" + this.moduleName + "Ctrl' })";
    if (modulesApp.indexOf(insert) === -1) {
      fs.writeFileSync(base + '/public/modules/app.js', modulesApp.replace(hook, insert+'\n'+hook));
    }
  }
});

module.exports = TodoGenerator;