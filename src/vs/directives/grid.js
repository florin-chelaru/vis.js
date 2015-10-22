/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vs.directives.Grid');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.svg.decorators.Grid');
goog.require('vs.ui.canvas.decorators.Grid');

/**
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Grid = function() {
  vs.directives.GraphicDecorator.call(this);
};

goog.inherits(vs.directives.Grid, vs.directives.GraphicDecorator);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {jQuery} $targetElement
 * @param {vs.async.TaskService} taskService
 * @param {vs.ui.Visualization} target
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Grid.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) {
  switch (target.options.render) {
    case 'svg':
      return new vs.ui.svg.decorators.Grid($scope, $element, $attrs, taskService, $targetElement, target);
    case 'canvas':
      return new vs.ui.canvas.decorators.Grid($scope, $element, $attrs, taskService, $targetElement, target);
  }
};
