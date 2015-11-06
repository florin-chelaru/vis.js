/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vs.directives.Axis');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.VisHandler');
goog.require('vs.ui.svg.SvgAxis');
goog.require('vs.ui.canvas.CanvasAxis');

goog.require('vs.async.TaskService');

/**
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Axis = function() {
  vs.directives.GraphicDecorator.apply(this, arguments);
};

goog.inherits(vs.directives.Axis, vs.directives.GraphicDecorator);

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: Function, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Axis.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgAxis($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasAxis($ng, $targetElement, target, options);
  }
  return null;
};
