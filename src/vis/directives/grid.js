/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Grid');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.GraphicDecorator');

goog.require('vis.ui.svg.decorators.Grid');
goog.require('vis.ui.canvas.decorators.Grid');

/**
 * @constructor
 * @extends {vis.directives.GraphicDecorator}
 */
vis.directives.Grid = function() {
  vis.directives.GraphicDecorator.call(this);
};

goog.inherits(vis.directives.Grid, vis.directives.GraphicDecorator);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {jQuery} $targetElement
 * @param {vis.async.TaskService} taskService
 * @param {vis.ui.Visualization} target
 * @returns {vis.ui.Decorator}
 * @override
 */
vis.directives.Grid.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) {
  switch (target.options.render) {
    case 'svg':
      return new vis.ui.svg.decorators.Grid($scope, $element, $attrs, taskService, $targetElement, target);
    case 'canvas':
      return new vis.ui.canvas.decorators.Grid($scope, $element, $attrs, taskService, $targetElement, target);
  }
};
