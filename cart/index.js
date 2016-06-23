/*jshint latedef:false */
var path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var meanpGen = require('../app/index');

var CartGenerator = meanpGen.extend({
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
        this.log(yosay('This is the meanp cart generator!'));
        var prompts = [{
            name: 'moduleName',
            message: 'How would you like to name your cart?',
            default: this.attrs ? this.attrs.name : 'cart'
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
            origin: src + '/cart.html',
            dest: path + '/views/cart.html'
        },{
            origin: src + '/products.html',
            dest: path + '/views/products.html'
        },{
            origin: src + '/cartCtrl.js',
            dest: path + '/controllers/cartCtrl.js',
            inject: true,
            html: 'cart',
            path: '/cart'
        },{
            origin: src + '/productsCtrl.js',
            dest: path + '/controllers/productsCtrl.js',
            inject: true,
            html: 'products',
            path: '/products'
        },{
            origin: src + '/paymentService.js',
            dest: path + '/services/paymentService.js',
            inject: true
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
                var htmlHook = '<!-- //===== meanp-cli hook =====// -->'
                var indexHtml = this.readFileAsString(base + '/public/index.html');
                var inserTag = "<script src='modules/" + this.moduleName + '/' + files[counter].dest.substr(indexOfFolder) + "'></script>";
                if (indexHtml.indexOf(inserTag) === -1) {
                    fs.writeFileSync(base + '/public/index.html', indexHtml.replace(htmlHook, inserTag+'\n'+htmlHook));
                }
                var hook   = '//===== meanp-cli hook =====//';
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

module.exports = CartGenerator;