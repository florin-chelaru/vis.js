/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 3:50 PM
 */

goog.provide('vis.directives.Resizable');

goog.require('vis.ui.decorators.Decorator');

/**
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Resizable = function() {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A',
    template:
      '<div class="resize-grab grab-top-left"></div>' +
      '<div class="resize-grab grab-top-right"></div>' +
      '<div class="resize-grab grab-bottom-left"></div>' +
      '<div class="resize-grab grab-bottom-right"></div>'
  });
};

goog.inherits(vis.directives.Resizable, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Resizable.prototype.link = function($scope, $element, $attrs, controller) {

};
