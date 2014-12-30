/*jshint latedef:false */
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
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
    this.log(yosay('This is the todo mean blog generator!'));
    var prompts = [{
      name: 'moduleName',
      message: 'How would you like to name your new blog?',
      default: this.attrs ? this.attrs.name : 'mini-blog'
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
      origin: src + '/editPost.html',
      dest: path + '/views/editPost.html'
    },{
      origin: src + '/myPosts.html',
      dest: path + '/views/myPosts.html'
    },{
      origin: src + '/newPost.html',
      dest: path + '/views/newPost.html'
    },{
      origin: src + '/postDetails.html',
      dest: path + '/views/postDetails.html'
    }, {
      origin: src + '/css/bootstrap-theme.min.css',
      dest: path + '/assets/css/bootstrap-theme.min.css'
    },{
      origin: src + '/css/bootstrap.min.css',
      dest: path + '/assets/css/bootstrap.min.css'
    },{
      origin: src + '/css/myCSS.css',
      dest: path + '/assets/css/myCSS.css'
    },{
      origin: src + '/css/toaster.css',
      dest: path + '/assets/css/toaster.css'
    },{
      origin: src + '/editPostCtrl.js',
      dest: path + '/controllers/editPostCtrl.js',
      inject: true,
      html: 'editPost',
      path: '/edit/:postId'
    },{
      origin: src + '/myPostsCtrl.js',
      dest: path + '/controllers/myPostsCtrl.js',
      inject: true,
      html: 'myPosts',
      path: '/posts',
      menu: true
    },{
      origin: src + '/newPostCtrl.js',
      dest: path + '/controllers/newPostCtrl.js',
      inject: true,
      html: 'newPost',
      path: '/addpost'
    },{
      origin: src + '/postDetailsCtrl.js',
      dest: path + '/controllers/postDetailsCtrl.js',
      inject: true,
      html: 'postDetails',
      path: '/posts/:postId'
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
        var hook   = '//===== mean-cli hook =====//';
        var modulesApp   = this.readFileAsString(base + '/public/modules/app.js');
        var insert = ".when('" + files[counter].path + "', {templateUrl: 'modules/" + this.moduleName + "/views/" + files[counter].html +".html', controller: '" + files[counter].html + "Ctrl' })";
        if (modulesApp.indexOf(insert) === -1) {
          fs.writeFileSync(base + '/public/modules/app.js', modulesApp.replace(hook, insert+'\n'+hook));
        }
        if(files[counter].menu){
          var menuFile = require(base + '/api/config/menus');
          menuFile[this.moduleName] = menuFile[this.moduleName] ? menuFile[this.moduleName] : {};
          menuFile[this.moduleName].name = this.moduleName;
          menuFile[this.moduleName].path = files[counter].path;
          fs.writeFileSync(base + '/api/config/menus.json', JSON.stringify(menuFile));
        }

      }
      console.log(chalk.green(files[counter].dest.substr(indexOfFolder) + ' file was successfully created'));
    };
  }
});

module.exports = TodoGenerator;