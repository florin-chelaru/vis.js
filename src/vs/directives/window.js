/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 1:41 PM
 */

goog.provide('vs.directives.Window');

goog.require('vs.directives.Directive');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Window = function() {
  vs.directives.Directive.apply(this, arguments);
};

goog.inherits(vs.directives.Window, vs.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.Window.prototype.link = {
  pre: function($scope, $element, $attrs, controller) {
    var $window = $('<div class="vs-window"></div>').appendTo($element.parent());

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
