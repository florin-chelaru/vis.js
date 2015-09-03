/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vis');

goog.require('vis.Configuration');
goog.require('vis.ui.VisualizationFactory');
goog.require('vis.ui.Visualization');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.Axis');

vis.main = angular.module('vis', []);

vis.main.provider('configuration', function() {
  var self = this;
  self.__proto__ = new vis.Configuration();
  self.$get = function() { return self; };
});

vis.main.factory('visualizationFactory', ['configuration', function(configuration) {
  return new vis.ui.VisualizationFactory(configuration);
}]);

vis.main.directive('visualization', ['visualizationFactory', function(visualizationFactory) {
  return new vis.directives.Visualization(visualizationFactory);
}]);

vis.main.directive('visAxis', function() {
  return new vis.directives.Axis();
});

// TODO: Later
vis.main.directive('vis-input-data', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});

// TODO: Later
vis.main.directive('vis-options', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});

vis.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});


