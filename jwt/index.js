/*jshint latedef:false */
var _path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var meanpGen = require('../app/index');

var LoginJwtGenerator = meanpGen.extend({
    constructor: function () {
        meanpGen.apply(this, arguments);
        this.attrs = this.arguments.map(function (attr) {
            var parts = attr.split();
            return {
                name: parts[0],
                action: parts[1]
            };
        })[0];

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
        this.log(yosay('This is the meanp login generator. Let me configure the module'));
        done();
    },
    afterConfirm: function(){
        var base = this.dest._base;
        var src = this.src._base;
        var path = base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base';

        //Files of the template
        var files = [{
            origin: src + '/login.js',
            dest: path + '/controllers/login.js'
        },{
            origin: src + '/auth.js',
            dest: path + '/controllers/auth.js'
        },{
            origin: src + '/authService.js',
            dest: path + '/services/authService.js'
        },{
            origin: src + '/User.js',
            dest: path + '/services/User.js'
        },{
            origin: src + '/login.html',
            dest: path + '/views/login.html'
        }];

        counter = 0;
        for(counter in files){
            var fileContent = this.readFileAsString(files[counter].origin);
            if(fileContent){
                fs.writeFileSync(files[counter].dest, fileContent);
            }
        }

        // Reading files
        var apiBase = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js');
        var modulesApp   = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js');
        var navBarHtml = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html');
        var apiAuthCtrl = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'middlewares' + _path.sep + 'authentication.js');
        var apiBootstrap   = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'config' + _path.sep + 'bootstrap.js');
        var packageFile = this.readFileAsString(base + _path.sep + 'package.json');
        packageFile = JSON.parse(packageFile);

        // Hooks
        var hook1 = "/*===== jwt hook1 =====*/";
        var hook2 = "/*===== jwt hook2 =====*/";
        var hook3 = "/*===== jwt hook3 =====*/";
        var hook4 = "req.decoded = token;next();";
        var modulesHook1 = "//===== meanp-cli hook =====//";
        var modulesHook2 = "//===== meanp-cli login hook =====//";
        var modulesHook3 = "return true;";
        var apiHook = "/*===== login hook =====*/";
        var loginHook = "<!-- //===== meanp-cli login hook2 =====// -->";
        var loginAuthHook1 = "/*===== login hook auth #1 =====*/";
        var loginAuthHook2 = "/*===== login hook auth #2 =====*/";
        var loginAuthHook3 = "/*===== login hook auth #3 =====*/";
        var loginAuthHook4 = "/*===== login hook auth #4 =====*/";


        // Values to insert
        packageFile.dependencies['jsonwebtoken'] = "5.0.2";
        var loginInsert = "authenticationMiddleware.verifySignature, authorizationMiddleware.getAuthorizationFn('menu', 'view'),";
        var modulesInsert1 = ".when('/login', { templateUrl: 'modules/base/views/login.html', controller: 'LoginCtrl', requireAuth: false })" + '\n  ' + ".when('/signup', { templateUrl: 'modules/base/views/signup.html', controller: 'SignupCtrl', requireAuth: false})";
        var modulesInsert2 = "var nextPath = $location.path();var nextRoute = $route.routes[nextPath];" + '\n  '  + "  if (nextRoute && nextRoute.requireAuth && !authService.isAuthed()) {$location.path('/login');}";
        var modulesInsert3 = "return authService.isAuthed() !== null && authService.isAuthed() !== false;";
        var loginInsertHtml = "<li><a href='#'>Welcome, {{ getCurrentUser().username }}</a></li><li><a href='#/login' ng-click='logout()'>Logout</a></li>";

        var loginAuthInsert1 = "'base/authController',";
        var loginAuthInsert2 = "authController, ";
        var loginAuthInsert3 = "app.post('/auth/', authorizationMiddleware.getAuthorizationFn('login', 'create'),  authController.authenticate);";
        var loginAuthInsert4 = "simpleDI.define('base/authController', 'base/controllers/auth');";

        var insert1 = ", 'app/config'";
        var insert2 = ", appConfig";
        var insert3 = "var secretKey = appConfig.secretKey;";
        var insert4 = "jwt.verify(token, secretKey, function (err, decodedToken) { if (err) { return res.json(401, { message: 'Failed to authenticate token.' }); } else { req.decoded = decodedToken; next(); }});";

        // Insert the content
        apiAuthCtrl = apiAuthCtrl.replace(hook1, insert1);
        apiAuthCtrl = apiAuthCtrl.replace(hook2, insert2);
        apiAuthCtrl = apiAuthCtrl.replace(hook3, insert3);
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'middlewares' + _path.sep + 'authentication.js', apiAuthCtrl.replace(hook4, insert4));

        apiBase = apiBase.replace(loginAuthHook1, loginAuthInsert1);
        apiBase = apiBase.replace(loginAuthHook2, loginAuthInsert2);
        apiBase = apiBase.replace(loginAuthHook3, loginAuthInsert3);
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js', apiBase.replace(apiHook, loginInsert));

        fs.writeFileSync(base + _path.sep + 'package.json', JSON.stringify(packageFile));

        modulesApp = modulesApp.replace(modulesHook1, modulesInsert1 + '\n  ' + modulesHook1);
        modulesApp = modulesApp.replace(modulesHook2, modulesInsert2);
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js', modulesApp.replace(modulesHook3, modulesInsert3));

        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html', navBarHtml.replace(loginHook, loginInsertHtml));

        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'config' + _path.sep + 'bootstrap.js', apiBootstrap.replace(loginAuthHook4, loginAuthInsert4));
    }
});

module.exports = LoginJwtGenerator;
