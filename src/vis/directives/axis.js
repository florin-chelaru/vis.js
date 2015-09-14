/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Axis');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.GraphicDecorator');

goog.require('vis.ui.svg.decorators.Axis');
goog.require('vis.ui.canvas.decorators.Axis');

/**
 * @constructor
 * @extends {vis.directives.GraphicDecorator}
 */
vis.directives.Axis = function() {
  vis.directives.GraphicDecorator.call(this, { type: '@', ticks: '@' });
};

goog.inherits(vis.directives.Axis, vis.directives.GraphicDecorator);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @returns {vis.ui.Decorator}
 * @override
 */
vis.directives.Axis.prototype.createHandler = function($scope, $element, $attrs, $targetElement) {
  switch ($targetElement.attr('render')) {
    case 'svg':
      return new vis.ui.svg.decorators.Axis($scope, $element, $attrs, $targetElement);
    case 'canvas':
      return new vis.ui.canvas.decorators.Axis($scope, $element, $attrs, $targetElement);
  }
};

