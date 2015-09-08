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
    restrict: 'A',
    replace: false,
    transclude: false,
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
  $element
    .css('position', 'absolute')
    .append('<div class="resize-grab grab-top-left"></div>')
    .append('<div class="resize-grab grab-top-right"></div>')
    .append('<div class="resize-grab grab-bottom-left"></div>')
    .append('<div class="resize-grab grab-bottom-right"></div>');

  // TODO: Move the margin (5) in a configuration file;
  // TODO: Caution: this is correlated to resizable.css: 5 = .resize-grab[width] - .resize-grab.grab-top-left[left]
  var box = new vis.directives.Resizable.BoundingBox($element, 5);

  var startX, startY, target;

  $element.find('.resize-grab').on('mousedown', function(event) {
    // Prevent default dragging of selected content
    event.preventDefault();
    target = box.getHandler($(this));
    startX = event.pageX - target.left;
    startY = event.pageY - target.top;
    $scope.$document.on('mousemove', mousemove);
    $scope.$document.on('mouseup', mouseup);
  });

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
  }
};

/**
 * @param {jQuery} $elem
 * @constructor
 */
vis.directives.Resizable.ResizeHandler = function($elem) {
  /**
   * @type {jQuery}
   */
  this.$elem = $elem;
  var rect = $elem[0].getBoundingClientRect();
  this.top = rect.top;
  this.left = rect.left;
  this.width = rect.width;
  this.height = rect.height;
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Resizable.ResizeHandler}
 */
vis.directives.Resizable.ResizeHandler.topLeft = function($elem) {
  return new vis.directives.Resizable.ResizeHandler($elem.find('.grab-top-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Resizable.ResizeHandler}
 */
vis.directives.Resizable.ResizeHandler.topRight = function($elem) {
  return new vis.directives.Resizable.ResizeHandler($elem.find('.grab-top-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Resizable.ResizeHandler}
 */
vis.directives.Resizable.ResizeHandler.bottomLeft = function($elem) {
  return new vis.directives.Resizable.ResizeHandler($elem.find('.grab-bottom-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Resizable.ResizeHandler}
 */
vis.directives.Resizable.ResizeHandler.bottomRight = function($elem) {
  return new vis.directives.Resizable.ResizeHandler($elem.find('.grab-bottom-right'));
};

/**
 * @param {jQuery} $element
 * @param {number} margin
 * @constructor
 */
vis.directives.Resizable.BoundingBox = function($element, margin) {
  this.topLeft = vis.directives.Resizable.ResizeHandler.topLeft($element);
  this.topRight = vis.directives.Resizable.ResizeHandler.topRight($element);
  this.bottomLeft = vis.directives.Resizable.ResizeHandler.bottomLeft($element);
  this.bottomRight = vis.directives.Resizable.ResizeHandler.bottomRight($element);
  this._margin = margin;
};

/**
 * @param {jQuery} $elem
 * @returns {vis.directives.Resizable.ResizeHandler}
 */
vis.directives.Resizable.BoundingBox.prototype.getHandler = function($elem) {
  switch ($elem[0]) {
    case this.topLeft.$elem[0]:
      return this.topLeft;
    case this.bottomLeft.$elem[0]:
      return this.bottomLeft;
    case this.topRight.$elem[0]:
      return this.topRight;
    case this.bottomRight.$elem[0]:
      return this.bottomRight;
    default:
      return null;
  }
};

/**
 * @param {vis.directives.Resizable.ResizeHandler} handler
 */
vis.directives.Resizable.BoundingBox.prototype.update = function(handler) {
  switch (handler) {
    case this.topLeft:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin);
      this.bottomLeft.left = handler.left;
      this.topRight.top = handler.top;
      break;
    case this.bottomLeft:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin);
      this.topLeft.left = handler.left;
      this.bottomRight.top = handler.top;
      break;
    case this.topRight:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin);
      this.topLeft.top = handler.top;
      this.bottomRight.left = handler.left;
      break;
    case this.bottomRight:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin);
      this.topRight.left = handler.left;
      this.bottomLeft.top = handler.top;
      break;
  }
};

Object.defineProperties(vis.directives.Resizable.BoundingBox.prototype, {
  left: {
    get: function() { return this.topLeft.left + this.topLeft.width + this._margin; }
  },
  top: {
    get: function() { return this.topLeft.top + this.topLeft.height + this._margin; }
  },
  width: {
    get: function() {
      return this.topRight.left - this.topLeft.left - this.topLeft.width - 2 * this._margin;
    }
  },
  height: {
    get: function() {
      return this.bottomLeft.top - this.topLeft.top - this.topLeft.height - 2 * this._margin;
    }
  }
});
