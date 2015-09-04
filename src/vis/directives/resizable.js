/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 3:50 PM
 */

goog.provide('vis.directives.Resizable');

goog.require('vis.ui.decorators.Decorator');

/**
 * @param $document
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Resizable = function($document) {
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'E',// TODO: Change back to A and move in the elemen
    templateUrl: 'res/templates/_resizable.html',
    // replace: false,
    transclude: true,
    controller: function($scope) {
      $scope.self = self;
      $scope.$document = $document;
      $scope.doSomething = function() {
      }
    }
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
  $element.parent()
    .css('position', 'absolute');// TODO: Revert to this again
    //.append('<div class="resize-grab grab-top-left" ng-click="doSomething()"></div>')
    //.append('<div class="resize-grab grab-top-right"></div>')
    //.append('<div class="resize-grab grab-bottom-left"></div>')
    //.append('<div class="resize-grab grab-bottom-right"></div>');

  $topLeft = $element.find('.grab-top-left');
  $topRight = $element.find('.grab-top-right');
  $bottomLeft = $element.find('.grab-bottom-left');
  $bottomRight = $element.find('.grab-bottom-right');

  var boundingBox = $element.parent()[0].getBoundingClientRect();

  //var startX, startY, x, y, $target;
  var startX = 0, startY = 0, x = 0, y = 0;
  var $target;

  $element.find('.resize-grab').on('mousedown', function(event) {
    // Prevent default dragging of selected content
    event.preventDefault();
    $target = $(this);
    var offset = $target.position();
    x = offset.left;
    y = offset.top;
    startX = event.pageX - x;
    startY = event.pageY - y;
    $scope.$document.on('mousemove', mousemove);
    $scope.$document.on('mouseup', mouseup);
  });

  function mousemove(event) {
    var newY = event.pageY - startY;
    var newX = event.pageX - startX;
    var delta;

    //switch ($target[0]) {
    //  case $topLeft[0]:
    //    newX = Math.min(newX, boundingBox.right - 25);
    //    newY = Math.min(newY, boundingBox.bottom - 25);
    //    /*delta = {
    //      dx: newX + 25 - boundingBox.left,
    //      dy: newY + 25 - boundingBox.top
    //    };
    //    $element.parent().css({
    //      top: (y + 25) + 'px',
    //      left: (x + 25) + 'px'
    //    });*/
    //    break;
    //  case $topRight[0]:
    //    newX = Math.max(newX, boundingBox.left + 10);
    //    newY = Math.min(newY, boundingBox.bottom - 25);
    //    /*delta = {
    //      dx: newX - 10 - boundingBox.right,
    //      dy: newY + 25 - boundingBox.top
    //    };
    //    $element.parent().css({
    //      top: (y + 25) + 'px'
    //    });*/
    //    break;
    //  case $bottomLeft[0]:
    //    newX = Math.min(newX, boundingBox.right - 25);
    //    newY = Math.max(newY, boundingBox.top + 10);
    //    /*delta = {
    //      dx: newX + 25 - boundingBox.left,
    //      dy: newY - 10 - boundingBox.bottom
    //    };
    //    $element.parent().css({
    //      left: (x + 25) + 'px'
    //    });*/
    //    break;
    //  case $bottomRight[0]:
    //    newX = Math.max(newX, boundingBox.left + 10);
    //    newY = Math.max(newY, boundingBox.top + 10);
    //    /*delta = {
    //      dx: newX - 10 - boundingBox.right,
    //      dy: newY - 10 - boundingBox.bottom
    //    };*/
    //    break;
    //}

    y = newY;
    x = newX;
    $target.css({
      top: y + 'px',
      left:  x + 'px'
    });

    /*$element.parent().css({
      width: boundingBox.width - delta.dx,
      height: boundingBox.height - delta.dy
    });*/
    //boundingBox = $element.parent()[0].getBoundingClientRect();
    //$element.parent().trigger($.Event('resize', delta));
  }

  function mouseup() {
    $scope.$document.off('mousemove', mousemove);
    $scope.$document.off('mouseup', mouseup);
  }
};
