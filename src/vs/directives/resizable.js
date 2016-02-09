/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 3:50 PM
 */

goog.provide('vs.directives.Resizable');

/**
 * @param {angular.Scope} $scope
 * @param $document
 * @constructor
 * @extends {ngu.Directive}
 */
vs.directives.Resizable = function($scope, $document) {
  ngu.Directive.apply(this, arguments);

  /**
   * Angular document
   * @private
   */
  this._document = $document;

  /**
   * @type {number}
   * @private
   */
  this._minWidth = 65;

  /**
   * @type {number}
   * @private
   */
  this._minHeight = 65;
};

goog.inherits(vs.directives.Resizable, ngu.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.Resizable.prototype.link = function($scope, $element, $attrs, controller) {
  ngu.Directive.prototype.link['post'].apply(this, arguments);
  //var $window = $scope['vsWindow']['handler']['$window'];
  var $window = $scope['vsWindow']['$window'];
  $window
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-top-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-top-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-bottom-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-bottom-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-vertical vs-grab-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-vertical vs-grab-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-horizontal vs-grab-bottom"></div>');

  var box;
  var startX, startY, target;

  var self = this;
  function mousedown(event) {
    // Prevent default dragging of selected content
    event.stopPropagation();
    event.preventDefault();
    box = new vs.directives.Resizable.BoundingBox($window);
    target = box.getHandler($(this));
    startX = event.pageX - target.left;
    startY = event.pageY - target.top;
    self._document.on('mousemove', mousemove);
    self._document.on('mouseup', mouseup);

    $window.trigger($.Event('resizestart', {}));
    $element.trigger($.Event('resizestart', {}));
  }

  function mousemove(event) {

    event.stopPropagation();
    event.preventDefault();

    var newY = event.pageY - startY;
    var newX = event.pageX - startX;

    target.top = newY;
    target.left = newX;

    box.update(target, self._minWidth, self._minHeight);
    
    $window.css({
      'top': (box.top) + 'px',
      'left': (box.left) + 'px',
      'width': box.width + 'px',
      'height': box.height + 'px'
    });

    $element.css({
      'top': (box.top) + 'px',
      'left': (box.left) + 'px',
      'width': box.width + 'px',
      'height': box.height + 'px'
    });

    $window.trigger($.Event('resize', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
    $element.trigger($.Event('resize', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
  }

  function mouseup(event) {
    event.preventDefault();
    event.stopPropagation();
    self._document.off('mousemove', mousemove);
    self._document.off('mouseup', mouseup);
    $window.trigger($.Event('resizeend', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
    $element.trigger($.Event('resizeend', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
  }

  $window.find('> .vs-resize-grab').on('mousedown', mousedown);
};

/**
 * @param {jQuery} $elem
 * @constructor
 */
vs.directives.Resizable.ResizeHandler = function($elem) {
  /** @type {jQuery} */
  this.$elem = $elem;
  var rect = $elem[0].getBoundingClientRect();

  // We compute the relative position of this handler to the window's parent element
  // We add 1 to each because jQuery.position() includes all margins and borders; so if we change the border of window,
  // this should also change
  var pos = {left:$elem.position().left + $elem.parent().position().left + 1, top:$elem.position().top + $elem.parent().position().top + 1};
  this.top = pos.top;
  this.left = pos.left;
  this.width = rect.width;
  this.height = rect.height;
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.topLeft = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-top-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.topRight = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-top-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottomLeft = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottomRight = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.left = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.right = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottom = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom'));
};

/**
 * @param {jQuery} $element
 * @constructor
 */
vs.directives.Resizable.BoundingBox = function($element) {
  this.offset = $element.position();
  this.topLeft = vs.directives.Resizable.ResizeHandler.topLeft($element);
  this.topRight = vs.directives.Resizable.ResizeHandler.topRight($element);
  this.bottomLeft = vs.directives.Resizable.ResizeHandler.bottomLeft($element);
  this.bottomRight = vs.directives.Resizable.ResizeHandler.bottomRight($element);
  this.leftHandler = vs.directives.Resizable.ResizeHandler.left($element);
  this.rightHandler = vs.directives.Resizable.ResizeHandler.right($element);
  this.bottomHandler = vs.directives.Resizable.ResizeHandler.bottom($element);

  // This assumes that all handlers are square and of the same size
  // The 1 corresponds to the border
  this._margin = -this.topLeft.width * 0.5 - 1;
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.BoundingBox.prototype.getHandler = function($elem) {
  switch ($elem[0]) {
    case this.topLeft.$elem[0]:
      return this.topLeft;
    case this.bottomLeft.$elem[0]:
      return this.bottomLeft;
    case this.topRight.$elem[0]:
      return this.topRight;
    case this.bottomRight.$elem[0]:
      return this.bottomRight;
    case this.leftHandler.$elem[0]:
      return this.leftHandler;
    case this.rightHandler.$elem[0]:
      return this.rightHandler;
    case this.bottomHandler.$elem[0]:
      return this.bottomHandler;
    default:
      return null;
  }
};

/**
 * @param {vs.directives.Resizable.ResizeHandler} handler
 * @param {number} [minWidth]
 * @param {number} [minHeight]
 */
vs.directives.Resizable.BoundingBox.prototype.update = function(handler, minWidth, minHeight) {
  minWidth = minWidth || 0;
  minHeight = minHeight || 0;
  switch (handler) {
    case this.topLeft:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin - minHeight);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin - minWidth);
      this.bottomLeft.left = handler.left;
      this.topRight.top = handler.top;
      this.leftHandler.left = handler.left;
      break;
    case this.bottomLeft:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin - minWidth);
      this.topLeft.left = handler.left;
      this.bottomRight.top = handler.top;
      this.leftHandler.left = handler.left;
      this.bottomHandler.top = handler.top;
      break;
    case this.topRight:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin - minHeight);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin + minWidth);
      this.topLeft.top = handler.top;
      this.bottomRight.left = handler.left;
      this.rightHandler.left = handler.left;
      break;
    case this.bottomRight:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin + minWidth);
      this.topRight.left = handler.left;
      this.bottomLeft.top = handler.top;
      this.rightHandler.left = handler.left;
      this.bottomHandler.top = handler.top;
      break;
    case this.leftHandler:
      handler.top = this.topLeft.top;
      handler.left = Math.min(handler.left, this.rightHandler.left - handler.width - 2 * this._margin - minWidth);

      this.topLeft.left = handler.left;
      this.bottomLeft.left = handler.left;

      break;
    case this.rightHandler:
      handler.top = this.topLeft.top;
      handler.left = Math.max(handler.left, this.leftHandler.left + this.leftHandler.width + 2 * this._margin + minWidth);

      this.topRight.left = handler.left;
      this.bottomRight.left = handler.left;

      break;
    case this.bottomHandler:
      handler.left = this.topLeft.left;
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);

      this.bottomRight.top = handler.top;
      this.bottomLeft.top = handler.top;
      break;
  }
};

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#left
 */
vs.directives.Resizable.BoundingBox.prototype.left;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#top
 */
vs.directives.Resizable.BoundingBox.prototype.top;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#width
 */
vs.directives.Resizable.BoundingBox.prototype.width;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#height
 */
vs.directives.Resizable.BoundingBox.prototype.height;

Object.defineProperties(vs.directives.Resizable.BoundingBox.prototype, {
  left: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() { return this.topLeft.left + this.topLeft.width + this._margin; })
  },
  top: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() { return this.topLeft.top + this.topLeft.height + this._margin; })
  },
  width: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() {
      return this.topRight.left - this.topLeft.left - this.topLeft.width - 2 * this._margin - 2;
    })
  },
  height: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() {
      return this.bottomLeft.top - this.topLeft.top - this.topLeft.height - this._margin - 1;
    })
  }
});
