'use strict';

/*
 * Defining the Module
 */
var Module = require('meanp').Module;

var __moduleName__ = new Module('__moduleName__');

__moduleName__.register(function(app, auth, database) {

    __moduleName__.routes(app, auth, database);

    __moduleName__.menus.add({
        title: '__moduleName__ example page',
        link: '__moduleName__ example page',
        roles: ['authenticated'],
        menu: 'main'
    });

    return __moduleName__;
});
