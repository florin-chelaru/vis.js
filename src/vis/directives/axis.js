/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Axis');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.GraphicDecorator');

goog.require('vis.ui.Visualization');
goog.require('vis.ui.svg.decorators.Axis');
goog.require('vis.ui.canvas.decorators.Axis');

goog.require('vis.async.TaskService');

/**
 * @constructor
 * @extends {vis.directives.GraphicDecorator}
 */
vis.directives.Axis = function() {
  vis.directives.GraphicDecorator.apply(this, arguments);
};

goog.inherits(vis.directives.Axis, vis.directives.GraphicDecorator);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vis.async.TaskService} taskService
 * @param {jQuery} $targetElement
 * @param {vis.ui.Visualization} target
 * @returns {vis.ui.Decorator}
 * @override
 */
vis.directives.Axis.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) {
  switch (target.options.render) {
    case 'svg':
      return new vis.ui.svg.decorators.Axis($scope, $element, $attrs, taskService, $targetElement, target);
    case 'canvas':
      return new vis.ui.canvas.decorators.Axis($scope, $element, $attrs, taskService, $targetElement, target);
  }
};
