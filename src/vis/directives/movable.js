/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 12:01 PM
 */

goog.provide('vis.directives.Movable');

goog.require('vis.directives.Directive');

/**
 * @param $scope
 * @param $document
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Movable = function($scope, $document) {
  vis.directives.Directive.apply(this, arguments);

  /**
   * Angular document
   * @private
   */
  this._document = $document;
};

goog.inherits(vis.directives.Movable, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Movable.prototype.link = function($scope, $element, $attrs, controller) {
  var $window = $element.parent();
  $window.css({ cursor: 'move' });

  var startX = 0, startY = 0, x, y;
  var windowMargin = 0;//-parseInt($window.css('top'));

  var $document = this._document;
  function mousedown(event) {
    if (event.target != $window[0]) { return; }

    // Prevent default dragging of selected content
    event.preventDefault();
    var windowRect = $window[0].getBoundingClientRect();
    x = windowRect.left;
    y = windowRect.top;
    startX = event.pageX - x;
    startY = event.pageY - y;
    $document.on('mousemove', mousemove);
    $document.on('mouseup', mouseup);
  }

  function mousemove(event) {
    y = event.pageY - startY;
    x = event.pageX - startX;
    $window.css({
      top: (y + windowMargin) + 'px',
      left:  x + 'px'
    });
  }

  function mouseup() {
    $document.off('mousemove', mousemove);
    $document.off('mouseup', mouseup);
  }

  $window.on('mousedown', mousedown);
};
