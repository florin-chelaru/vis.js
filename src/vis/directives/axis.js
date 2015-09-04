/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Axis');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.GraphicDecorator');

goog.require('vis.ui.decorators.Axis');

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
 * @returns {vis.ui.decorators.Decorator}
 * @override
 */
vis.directives.Axis.prototype.createHandler = function($scope, $element, $attrs, $targetElement) {
  return new vis.ui.decorators.Axis($scope, $element, $attrs, $targetElement);
};

