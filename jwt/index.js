/*jshint latedef:false */
var _path = require('path');
var fs = require('fs');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
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

        // Reading files
        var apiAuthCtrl = this.readFileAsString(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'controllers' + _path.sep + 'auth.js');
        var packageFile = this.readFileAsString(base + _path.sep + 'package.json');
        packageFile = JSON.parse(packageFile);

        // Hooks
        var hook1 = "/*===== jwt hook1 =====*/";
        var hook2 = "/*===== jwt hook2 =====*/";
        var hook3 = "/*===== jwt hook3 =====*/";
        var hook4 = "req.decoded = token;next();";

        // Values to insert
        packageFile.dependencies['jsonwebtoken'] = "5.0.2";
        var insert1 = ", 'app/config'";
        var insert2 = ", appConfig";
        var insert3 = "var secretKey = appConfig.secretKey;";
        var insert4 = "jwt.verify(token, secretKey, function (err, decodedToken) { if (err) { return res.json(401, { message: 'Failed to authenticate token.' }); } else { req.decoded = decodedToken; next(); }});";

        apiAuthCtrl = apiAuthCtrl.replace(hook1, insert1);
        apiAuthCtrl = apiAuthCtrl.replace(hook2, insert2);
        apiAuthCtrl = apiAuthCtrl.replace(hook3, insert3);

        // Insert the content
        fs.writeFileSync(base + _path.sep + 'api' + _path.sep + 'base' + _path.sep + 'controllers' + _path.sep + 'auth.js', apiAuthCtrl.replace(hook4, insert4));
        fs.writeFileSync(base + _path.sep + 'package.json', JSON.stringify(packageFile));
    }
});

module.exports = LoginJwtGenerator;
