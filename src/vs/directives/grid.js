/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vs.directives.Grid');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.svg.SvgGrid');
goog.require('vs.ui.canvas.CanvasGrid');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Grid = function($scope, taskService, $timeout) {
  vs.directives.GraphicDecorator.apply(this, arguments);
};

goog.inherits(vs.directives.Grid, vs.directives.GraphicDecorator);

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Grid.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgGrid($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasGrid($ng, $targetElement, target, options);
  }
  return null;
};
