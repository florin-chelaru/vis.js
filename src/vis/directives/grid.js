/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Grid');

goog.require('vis.directives.Visualization');
goog.require('vis.directives.Decorator');

goog.require('vis.ui.decorators.Grid');

/**
 * @constructor
 * @extends {vis.directives.Decorator}
 */
vis.directives.Grid = function() {
  vis.directives.Decorator.call(this, { type: '@', ticks: '@' });
};

goog.inherits(vis.directives.Grid, vis.directives.Decorator);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @returns {vis.ui.decorators.Decorator}
 * @override
 */
vis.directives.Grid.prototype.createHandler = function($scope, $element, $attrs, $targetElement) {
  return new vis.ui.decorators.Grid($scope, $element, $attrs, $targetElement);
};

