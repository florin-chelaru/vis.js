/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 12:01 PM
 */

goog.provide('vs.directives.Movable');

goog.require('vs.directives.Directive');

/**
 * @param $scope
 * @param $document
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Movable = function($scope, $document) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular document
   * @private
   */
  this._document = $document;

  // Adjust the following to match window.css

  /**
   * @type {number}
   * @private
   */
  this._windowMargin = 12;
};

goog.inherits(vs.directives.Movable, vs.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.Movable.prototype.link = function($scope, $element, $attrs, controller) {
  var $window = $element.parent();
  $window.css({ cursor: 'move' });

  var startX = 0, startY = 0, x, y;
  var windowMargin = this._windowMargin;

  var $document = this._document;
  function mousedown(event) {
    if (event.target != $window[0]) { return; }

    // Prevent default dragging of selected content
    event.preventDefault();
    //var windowRect = $window[0].getBoundingClientRect();
    //x = windowRect.left;
    //y = windowRect.top;
    var childOffset = $window.position();
    x = childOffset.left;
    y = childOffset.top;
    startX = event.pageX - x;
    startY = event.pageY - y;
    $document.on('mousemove', mousemove);
    $document.on('mouseup', mouseup);
  }

  function mousemove(event) {
    y = event.pageY - startY;
    x = event.pageX - startX;
    $window.css({
      top: y + 'px',
      left:  x + 'px'
    });
  }

  function mouseup() {
    $document.off('mousemove', mousemove);
    $document.off('mouseup', mouseup);
  }

  $window.on('mousedown', mousedown);
};