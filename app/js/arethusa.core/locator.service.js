"use strict";

angular.module('arethusa.core').service('locator', function($location) {
  // TODO
  // - Retrieve the uris from the route on startup
  // - Populate the locators obj from the config file
  var locators = { treebankRetriever: 'treebank' };

  this.getUri = function(name) {
    return $location.search()[locators[name]];
  };

  this.setUri = function(name, uri) {
    $location.search(name, uri);
  };
});