/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vs.directives.Axis');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.Visualization');
goog.require('vs.ui.svg.decorators.Axis');
goog.require('vs.ui.canvas.decorators.Axis');

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
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vs.async.TaskService} taskService
 * @param {jQuery} $targetElement
 * @param {vs.ui.Visualization} target
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Axis.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) {
  switch (target.options.render) {
    case 'svg':
      return new vs.ui.svg.decorators.Axis($scope, $element, $attrs, taskService, $targetElement, target);
    case 'canvas':
      return new vs.ui.canvas.decorators.Axis($scope, $element, $attrs, taskService, $targetElement, target);
  }
};
