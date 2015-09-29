/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vis');

goog.require('vis.Configuration');

goog.require('vis.async.TaskService');

goog.require('vis.models.Transformer');

goog.require('vis.ui.VisualizationFactory');
goog.require('vis.ui.Visualization');
goog.require('vis.ui.svg.SvgVisualization');
goog.require('vis.ui.canvas.CanvasVisualization');
goog.require('vis.ui.TrackVisualizationOptions');


goog.require('vis.directives.Visualization');

goog.require('vis.directives.Axis');
goog.require('vis.directives.Grid');

goog.require('vis.directives.Window');
goog.require('vis.directives.Movable');
goog.require('vis.directives.Resizable');


vis.main = angular.module('vis', []);

vis.main.provider('configuration', function() {
  var self = this;
  self.__proto__ = new vis.Configuration();
  self.$get = function() { return self; };
});

vis.main.factory('visualizationFactory', ['configuration', function(configuration) {
  return new vis.ui.VisualizationFactory(configuration);
}]);

vis.main.factory('taskService', ['$timeout', '$q', function($timeout, $q) {
  return new vis.async.TaskService($timeout, $q);
}]);

vis.main.directive('visualization', ['visualizationFactory', 'taskService', function(visualizationFactory, taskService) {
  return vis.directives.Directive.createNew('visualization', vis.directives.Visualization, [visualizationFactory, taskService], {restrict: 'A'/*, transclude: true, replace: false*/});
}]);

vis.main.directive('visWindow', function() {
  return vis.directives.Directive.createNew('visWindow', vis.directives.Window, null, {restrict: 'A'});
});

vis.main.directive('visMovable', ['$document', function($document) {
  return vis.directives.Directive.createNew('visMovable', vis.directives.Movable, [$document], {restrict: 'A', require: 'visWindow'});
}]);

vis.main.directive('visResizable', ['$document', function($document) {
  return vis.directives.Directive.createNew('visResizable', vis.directives.Resizable, [$document], {restrict: 'A', require: 'visWindow'});
}]);

vis.main.directive('visAxis', function() {
  return vis.directives.Directive.createNew('visAxis', vis.directives.Axis, null, {restrict: 'E', require: '^visualization'/*, transclude: true*/});
});

vis.main.directive('visGrid', function() {
  return vis.directives.Directive.createNew('visGrid', vis.directives.Grid, null, {restrict: 'E', require: '^visualization'/*, transclude: true*/});
});


/*
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
*/

vis.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});


