/*jshint latedef:false */
var _path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var meanpGen = require('../app/index');

var LoginAuth0Generator = meanpGen.extend({
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

        // Reading files
        var apiBase = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js');
        var modulesApp   = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js');
        var navBarHtml = this.readFileAsString(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html');
        var bowerFile = this.readFileAsString(base + _path.sep + 'bower.json');
        bowerFile = JSON.parse(bowerFile);
        
        // Hooks
        var apiHook = "/*===== login hook =====*/";
        var modulesHook1 = "//===== meanp-cli hook =====//";
        var modulesHook2 = "//===== meanp-cli login hook =====//";
        var modulesHook3 = "//===== meanp-cli login cgf hook =====//";
        var modulesHook4 = "return true;";
        var loginHook = "<!-- //===== meanp-cli login hook2 =====// -->";

        // Values to insert
        var loginInsert = "authenticationMiddleware.verifySignature, authenticationMiddleware.verifySecret, authorizationMiddleware.getAuthorizationFn('menu', 'view'),";
        var modulesInsert1 = ".when('/login', { templateUrl: 'modules/base/views/login.html', controller: 'LoginCtrl', requireAuth: false })" + '\n  ' + ".when('/signup', { templateUrl: 'modules/base/views/signup.html', controller: 'SignupCtrl', requireAuth: false})";
        var modulesInsert2 = "var nextPath = $location.path();var nextRoute = $route.routes[nextPath];" + '\n  '  + "  if (nextRoute && nextRoute.requireAuth && !authService.isAuthed()) {$location.path('/login');}";
        var modulesInsert3 = "configService.get().then(function() {auth.init({domain: $localStorage.auth0Domain,clientID: $localStorage.auth0ClientId,loginUrl: '/login'});}, function(err) {});";
        var modulesInsert4 = "return authService.isAuthed() !== null && authService.isAuthed() !== false";
        var loginInsertHtml = "<li><a href='#'>Welcome, {{ getCurrentUser().username }}</a></li><li><a href=' ng-click='logout()'>Logout</a></li>";

        bowerFile.dependencies['auth0-angular'] = "^4.2.2";
        // Insert the content
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'routes' + _path.sep + 'base.js', apiBase.replace(apiHook, loginInsert + '\n  ' + apiHook));
        modulesApp = modulesApp.replace(modulesHook1, modulesInsert1 + '\n  ' + modulesHook1)
        modulesApp = modulesApp.replace(modulesHook2, modulesInsert2)
        modulesApp = modulesApp.replace(modulesHook3, modulesInsert3)
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'app.js', modulesApp.replace(modulesHook4, modulesInsert4));
        fs.writeFileSync(base + _path.sep + 'public' + _path.sep + 'modules' + _path.sep + 'base' + _path.sep + 'views' + _path.sep + 'partials' + _path.sep + 'navbar.html', navBarHtml.replace(loginHook, loginInsertHtml));
        fs.writeFileSync(base + _path.sep + 'bower.json', JSON.stringify(bowerFile));
    }
});

module.exports = LoginAuth0Generator;
