/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 1:41 PM
 */

goog.provide('vis.directives.Window');

goog.require('vis.ui.decorators.Decorator');

/**
 * @param $document
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Window = function($document) {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A',
    replace: false,
    transclude: false,
    controller: function($scope) {
      $scope.self = self;
    }
  });
};

goog.inherits(vis.directives.Window, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Window.prototype.link = function($scope, $element, $attrs, controller) {
  $element
    .css({
      position: 'absolute'
    })
    .prepend('<div class="window"></div>');

  /*var resizing = false;

  function hover() { $element.find('.resize-show-on-hover').css({ visibility: 'visible' }); }
  function unhover() { $element.find('.resize-show-on-hover').css({ visibility: 'hidden' }); }

  $element.hover(hover, unhover);

  var box = new vis.directives.Window.BoundingBox($element);
  var startX, startY, target;

  function mousedown(event) {
    // Prevent default dragging of selected content
    event.preventDefault();
    resizing = true;
    target = box.getHandler($(this));
    startX = event.pageX - target.left;
    startY = event.pageY - target.top;
    $scope.$document.on('mousemove', mousemove);
    $scope.$document.on('mouseup', mouseup);
    $element.off('mouseenter mouseleave');
  }

  function mousemove(event) {
    var newY = event.pageY - startY;
    var newX = event.pageX - startX;

    target.top = newY;
    target.left = newX;

    box.update(target);

    $element.css({
      top: box.top + 'px',
      left: box.left + 'px',
      width: box.width + 'px',
      height: box.height + 'px'
    });
    $element.trigger($.Event('resize', {top: box.top, left: box.left, width: box.width, height: box.height}));
  }

  function mouseup() {
    $scope.$document.off('mousemove', mousemove);
    $scope.$document.off('mouseup', mouseup);
    $element.hover(hover, unhover);
  }

  $element.find('.resize-grab').on('mousedown', mousedown);*/
};
