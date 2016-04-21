/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 1:41 PM
 */

goog.provide('vs.directives.Window');

/**
 * @constructor
 * @extends {ngu.Directive}
 */
vs.directives.Window = function() {
  ngu.Directive.apply(this, arguments);

  /**
   * @type {jQuery}
   * @private
   */
  this._$window = null;
};

goog.inherits(vs.directives.Window, ngu.Directive);

/**
 * @type {jQuery}
 * @name vs.directives.Window#$window
 */
vs.directives.Window.prototype.$window;

Object.defineProperties(vs.directives.Window.prototype, {
  '$window': { get: /** @type {function (this:vs.directives.Window)} */ (function() { return this._$window; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Window.prototype.link = {
  'pre': function($scope, $element, $attrs, controller) {
    ngu.Directive.prototype.link['pre'].apply(this, arguments);
    var $window = $('<div class="vs-window-container"></div>').appendTo($element.parent());
    var style = $scope.$eval($attrs['vsStyle'] || '{}');

    var box = {
      'top': style['top'] || ($element.css('top') ? (parseInt($element.css('top'), 10) + parseInt($window.css('padding-top'), 10)) + 'px' : undefined),
      'left': style['left'] || $element.css('left') || undefined,
      'bottom': style['bottom'] || $element.css('bottom') || undefined,
      'right': style['right'] || $element.css('right') || undefined,
      'width': style['width'] || ($element.width() + 'px'),
      'height': style['height'] || ($element.height() + 'px')
    };

    /*$window.css({
      'top': (parseInt($element.css('top'), 10) + parseInt($window.css('padding-top'), 10)) + 'px',
      'left': $element.css('left'),
      'bottom': $element.css('bottom'),
      'right': $element.css('right')
    });*/
    $window.css(box);

    $element.css({
      'top': '',
      'left': '',
      'bottom': '',
      'right': ''
    });

    $window.append($element);

    // Bring to front when selected
    $window.on('mousedown', function() {
      $window.siblings().css('zIndex', 1031);
      $window.css('zIndex', 1032);
    });

    this._$window = $window;
  },
  'post': ngu.Directive.prototype.link['post']
};
