/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vs');

goog.require('vs.Configuration');

goog.require('vs.async.TaskService');

goog.require('vs.async.ThreadPoolService');

goog.require('vs.ui.VisualizationFactory');

goog.require('vs.ui.VisHandler');

goog.require('vs.ui.svg.SvgVis');
goog.require('vs.ui.canvas.CanvasVis');

goog.require('vs.directives.Visualization');

goog.require('vs.models.Transformer');
goog.require('vs.models.GenomicRangeQuery');

goog.require('vs.linking.LinkProvider');

goog.require('vs.directives.Axis');
goog.require('vs.directives.Grid');
goog.require('vs.directives.Brushing');

goog.require('vs.directives.Window');
goog.require('vs.directives.Movable');
goog.require('vs.directives.Resizable');

goog.require('vs.directives.LoadingDecorator');

goog.require('vs.directives.DataContext');

vs.main = angular.module('vs', []);

vs.main.provider('configuration', function() {
  return new vs.Configuration();
});

vs.main.provider('link', function() {
  return new vs.linking.LinkProvider();
});

vs.main.factory('taskService', ['$timeout', function($timeout) {
  return new vs.async.TaskService($timeout);
}]);

vs.main.factory('threadPool', ['configuration', function(config) {
  return new vs.async.ThreadPoolService(config);
}]);

vs.main.factory('visualizationFactory', ['configuration', 'taskService', '$timeout', 'threadPool', function(configuration, taskService, $timeout, threadPool) {
  return new vs.ui.VisualizationFactory(configuration, taskService, $timeout, threadPool);
}]);

vs.main.directive('visualization', ['visualizationFactory', 'taskService', '$rootScope', 'link', function() {
  return ngu.Directive.createNew('visualization', /** @type {function(new:ngu.Directive)} */ (vs.directives.Visualization), u.array.fromArguments(arguments), {restrict: 'C'});
}]);

vs.main.directive('vsDataContext', ['$templateCache', function() {
  return ngu.Directive.createNew('vsDataContext', /** @type {function(new:ngu.Directive)} */ (vs.directives.DataContext), u.array.fromArguments(arguments), {restrict: 'C', transclude: true, template: '<ng-transclude></ng-transclude><div ng-include="vsDataContext.template"></div>'});
}]);

vs.main.directive('vsWindow', function() {
  return ngu.Directive.createNew('vsWindow', /** @type {function(new:ngu.Directive)} */ (vs.directives.Window), null, {restrict: 'C'});
});

vs.main.directive('vsMovable', ['$document', function() {
  return ngu.Directive.createNew('vsMovable', /** @type {function(new:ngu.Directive)} */ (vs.directives.Movable), u.array.fromArguments(arguments), {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsResizable', ['$document', function() {
  return ngu.Directive.createNew('vsResizable', /** @type {function(new:ngu.Directive)} */ (vs.directives.Resizable), u.array.fromArguments(arguments), {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsLoader', ['taskService', '$timeout', function() {
  return ngu.Directive.createNew('vsLoader', /** @type {function(new:ngu.Directive)} */ (vs.directives.LoadingDecorator), u.array.fromArguments(arguments), {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsAxis', ['taskService', '$timeout', function() {
  return ngu.Directive.createNew('vsAxis', /** @type {function(new:ngu.Directive)} */ (vs.directives.Axis), u.array.fromArguments(arguments), {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsGrid', ['taskService', '$timeout', function() {
  return ngu.Directive.createNew('vsGrid', /** @type {function(new:ngu.Directive)} */ (vs.directives.Grid), u.array.fromArguments(arguments), {restrict: 'C', require: '^visualization'});
}]);

/*vs.main.directive('vsBrushing', ['taskService', '$timeout', '$rootScope', 'link', function() {
  return ngu.Directive.createNew('vsBrushing', /!** @type {function(new:ngu.Directive)} *!/ (vs.directives.Brushing), u.array.fromArguments(arguments), {restrict: 'C', require: '^visualization'});
}]);*/

vs.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});
