/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 12:01 PM
 */

goog.provide('vis.directives.Movable');

goog.require('vis.ui.decorators.Decorator');

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
    controller: function($scope) {
      $scope.self = self;
      $scope.$document = $document;
    }
  });
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
  $window = $element.find('.window');
  $window.css({ cursor: 'move' });

  var startX = 0, startY = 0, x, y;
  var windowMargin = -parseInt($window.css('top'));

  function mousedown(event) {
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
    $element.css({
      top: (y + windowMargin) + 'px',
      left:  x + 'px'
    });
  }

  function mouseup() {
    $scope.$document.off('mousemove', mousemove);
    $scope.$document.off('mouseup', mouseup);
  }

  $element.find('.window').on('mousedown', mousedown);
};
