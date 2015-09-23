/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 1:41 PM
 */

goog.provide('vis.directives.Window');

goog.require('vis.directives.Directive');

/**
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Window = function() {
  vis.directives.Directive.apply(this, arguments);
};

goog.inherits(vis.directives.Window, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Window.prototype.link = {
  pre: function($scope, $element, $attrs, controller) {
    var $window = $('<div class="window"></div>').appendTo($element.parent());

    $window.css({
      top: $element.css('top'),
      left: $element.css('left'),
      bottom: $element.css('bottom'),
      right: $element.css('right')
    });

    $element.css({
      top: '',
      left: '',
      bottom: '',
      right: ''
    });

    $window.append($element);

    // Bring to front when selected
    $window.on('mousedown', function() {
      $window.parent().append($window);
    });
}};
