/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 3:48 PM
 */

goog.provide('vis.directives.ControlDecorator');

goog.require('vis.ui.Decorator');

/**
 * TODO: Adapt
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.ControlDecorator = function() {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A'
  });
};

goog.inherits(vis.directives.ControlDecorator, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.ControlDecorator.prototype.link = function($scope, $element, $attrs, controller) {};
