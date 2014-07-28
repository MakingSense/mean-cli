'use strict';

var path = require('path'),
    auth = require('config/auth');

module.exports = function(app) {
  // User Routes
  var __moduleName__ = require('__moduleName__/controllers/__moduleName__');
  app.get('/auth/__moduleName__', __moduleName__.get);
}