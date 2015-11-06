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

  /**
   * @type {jQuery}
   * @private
   */
  this._$window = null;
};

goog.inherits(vs.directives.Window, vs.directives.Directive);

/**
 * @type {jQuery}
 * @name vs.directives.Window#$window
 */
vs.directives.Window.prototype.$window;

Object.defineProperties(vs.directives.Window.prototype, {
  $window: { get: /** @type {function (this:vs.directives.Window)} */ (function() { return this._$window; })}
});

/**
 * @type {{pre: function(angular.Scope, jQuery, angular.Attributes)}}
 */
vs.directives.Window.prototype.link = {
  'pre': function($scope, $element, $attrs, controller) {
    vs.directives.Directive.prototype.link['pre'].apply(this, arguments);
    var $window = $('<div class="vs-window-container"></div>').appendTo($element.parent());

    $window.css({
      'top': parseInt($element.css('top')) + parseInt($window.css('padding-top')) + 'px',
      'left': $element.css('left'),
      'bottom': $element.css('bottom'),
      'right': $element.css('right')
    });

    $element.css({
      'top': '',
      'left': '',
      'bottom': '',
      'right': ''
    });

    $window.append($element);

    // Bring to front when selected
    $window.on('mousedown', function() {
      $window.siblings().css('zIndex', 0);
      $window.css('zIndex', 1);
    });

    this._$window = $window;
}};
