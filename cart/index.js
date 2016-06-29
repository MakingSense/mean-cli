/*jshint latedef:false */
var _path = require('path');
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
        this.sourceRoot(_path.join(__dirname, dirPath));

        this.on('end', function () {
            if (!this.options['skip-install']) {
                this.installDependencies({
                    npm: true,
                    bower: true,
                    skipInstall: false
                });
            }
        });
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
        var path = base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + this.moduleName;
        var backendPath = base + _path.sep + 'api' + _path.sep;
        //Directory of the destination
        var directory = [
            base + _path.sep + 'public',
            base + _path.sep + 'public' + _path.sep + 'modules',
            path + _path.sep + 'controllers',
            path + _path.sep + 'services',
            path + _path.sep + 'assets',
            path + _path.sep + 'assets' + _path.sep + 'css',
            path + _path.sep + 'views',
            path + _path.sep + 'views' + _path.sep + 'partials'
        ];
        //Files of the template
        var files = [{
            origin: src + '/cart.html',
            dest: path + '/views/cart.html'
        },{
            origin: src + '/products.html',
            dest: path + '/views/products.html'
        },{
            origin: src + '/stripe.html',
            dest: path + '/views/stripe.html'
        },{
            origin: src + '/ng-addtocart.html',
            dest: path + '/views/partials/ng-addtocart.html'
        },{
            origin: src + '/ng-cart.html',
            dest: path + '/views/partials/ng-cart.html'
        },{
            origin: src + '/ng-checkout.html',
            dest: path + '/views/partials/ng-checkout.html'
        },{
            origin: src + '/ng-summary.html',
            dest: path + '/views/partials/ng-summary.html'
        },{
            origin: src + '/cartCtrl.js',
            dest: path + '/controllers/cartCtrl.js',
            inject: true,
            service: false,
            html: 'cart',
            path: '/cart'
        },{
            origin: src + '/productsCtrl.js',
            dest: path + '/controllers/productsCtrl.js',
            inject: true,
            service: false,
            html: 'products',
            path: '/products'
        },{
            origin: src + '/stripeCtrl.js',
            dest: path + '/controllers/stripeCtrl.js',
            inject: true,
            service: false,
            html: 'stripe',
            path: '/stripe'
        },{
            origin: src + '/paymentService.js',
            dest: path + '/services/paymentService.js',
            inject: true,
            service: true
        },{
            origin: src + '/payments.js',
            dest: backendPath + '/base/controllers/payments.js',
            inject: false
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
                var indexHtml = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'index.html');
                var inserTag = "<script src='modules/" + this.moduleName + '/' + files[counter].dest.substr(indexOfFolder) + "'></script>";
                if (indexHtml.indexOf(inserTag) === -1) {
                    fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'index.html', indexHtml.replace(htmlHook, inserTag+'\n  ' + htmlHook));
                }

                if(!files[counter].service){
                    var hook   = '//===== meanp-cli hook =====//';
                    var modulesApp   = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js');
                    var insert = ".when('" + files[counter].path + "', {templateUrl: 'modules/" + this.moduleName + "/views/" + files[counter].html +".html', controller: '" + files[counter].html + "Ctrl' })";
                    if (modulesApp.indexOf(insert) === -1) {
                        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js', modulesApp.replace(hook, insert + '\n       ' + hook));
                    }   
                }
            }
            console.log(chalk.green(files[counter].dest.substr(indexOfFolder) + ' file was successfully created'));
        }

        var apiBase   = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js');
        var apiBootstrap   = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'config' + _path.sep + 'bootstrap.js');
        var menuFile   = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'templates' + _path.sep + 'menus.json');
        var packageFile = this.readFileAsString(base + _path.sep + 'package.json');
        var bowerFile = this.readFileAsString(base + _path.sep + 'bower.json');

        packageFile = JSON.parse(packageFile);
        bowerFile = JSON.parse(bowerFile);
        menuFile = JSON.parse(menuFile);

        packageFile.devDependencies.stripe = "^4.7.0";
        bowerFile.dependencies['auth0-angular'] = "^4.2.2";
        bowerFile.dependencies['ngCart'] = "ngcart#^1.0.0";
        bowerFile.dependencies['angular-payments'] = "*";
        menuFile.base.push({
            "name": "Products",
            "path": "/products",
            "subMenu": null
        });

        var apiBootstrapData = {
            hook: '/*===== cart hook =====*/',
            insert: "simpleDI.define('base/paymentsController', 'base/controllers/payments');"
        };

        // Hooks values
        var hooksData = [
            {
                hook  : '/*===== cart hook #1 =====*/',
                insert: ",'base/paymentsController'"
            },
            {
                hook  : '/*===== cart hook #2 =====*/',
                insert: ", paymentsController"
            },
            {
                hook  : '/*===== cart hook #3 =====*/',
                insert: "app.post('/api/payments/stripe/', authenticationMiddleware.verifySignature, authenticationMiddleware.verifySecret, paymentsController.stripe);"
            }
        ];

        // Hook Replacing
        counter = 0;
        for(counter in hooksData){
            var hData = hooksData[counter];
            apiBase = apiBase.replace(hData.hook, hData.insert);
        }

        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js', apiBase);
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'config' + _path.sep + 'bootstrap.js', apiBootstrap.replace(apiBootstrapData.hook, apiBootstrapData.insert));

        fs.writeFileSync(base + _path.sep + 'package.json', JSON.stringify(packageFile));
        fs.writeFileSync(base + _path.sep + 'bower.json', JSON.stringify(bowerFile));
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'templates' + _path.sep + 'menus.json', JSON.stringify(menuFile));

        var indexHtml = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'index.html');
        var cartIndexDep = "<script src='lib/ngCart/dist/ngCart.js'></script><script src='lib/angular-payments/lib/angular-payments.min.js'></script>";
        indexHtml = indexHtml.replace(htmlHook, cartIndexDep + '\n  ' + htmlHook);

        var stripeUrl = "<script type='text/javascript' src='https://js.stripe.com/v2/'></script>" + '\n ' + " <script>Stripe.setPublishableKey('Stripe Secret Key');</script>";
        var stripeHook = "<!-- //===== meanp-cli stripe hook =====// -->";
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'index.html', indexHtml.replace(stripeHook, stripeUrl));

        var depHook = "'auth0'";
        var depInsert = "'auth0'," + '\n ' + "'ngCart', 'angularPayments'";
        var modulesApp   = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js');
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js', modulesApp.replace(depHook, depInsert));

        var navBarHtml = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html');
        var cartHook = "<!-- //===== meanp-cli cart hook =====// -->";
        var cartInsert = "<li><a href='#/cart' name='top'><ngcart-summary template-url='/modules/cart/views/partials/ng-summary.html' ></ngcart-summary></a></li>";
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html', navBarHtml.replace(cartHook, cartInsert));
    }
});

module.exports = CartGenerator;