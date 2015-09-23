/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 12:01 PM
 */

goog.provide('vis.directives.Movable');

goog.require('vis.directives.Directive');

/**
 * @param $document
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Movable = function($document) {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A',
    replace: false,
    transclude: false,
    controller: ['$scope', function($scope) {}]
  });

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

  function mousedown(event) {
    if (event.target != $window[0]) { return; }

    // Prevent default dragging of selected content
    event.preventDefault();
    var windowRect = $window[0].getBoundingClientRect();
    x = windowRect.left;
    y = windowRect.top;
    startX = event.pageX - x;
    startY = event.pageY - y;
    $scope.$document.on('mousemove', mousemove);
    $scope.$document.on('mouseup', mouseup);
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
    $scope.$document.off('mousemove', mousemove);
    $scope.$document.off('mouseup', mouseup);
  }

  $window.on('mousedown', mousedown);
};
