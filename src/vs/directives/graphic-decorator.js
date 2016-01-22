/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vs.directives.GraphicDecorator');

goog.require('vs.directives.Visualization');
goog.require('vs.ui.Decorator');
goog.require('vs.ui.VisHandler');

goog.require('vs.async.TaskService');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @param {boolean} [overridesVisHandler] If set to true, this flag will allow the decorator's draw methods to execute
 * before and after respectively of the VisHandler's beginDraw/endDraw methods.
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.GraphicDecorator = function($scope, taskService, $timeout, overridesVisHandler) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $timeout;

  /**
   * @type {vs.ui.Decorator}
   * @private
   */
  this._handler = null;

  /**
   * @type {boolean}
   * @private
   */
  this._overridesVisHandler = !!overridesVisHandler;
};

goog.inherits(vs.directives.GraphicDecorator, vs.directives.Directive);

/**
 * @type {vs.ui.Decorator}
 * @name vs.directives.GraphicDecorator#handler
 */
vs.directives.GraphicDecorator.prototype.handler;

Object.defineProperties(vs.directives.GraphicDecorator.prototype, {
  'handler': { get: /** @type {function (this:vs.directives.GraphicDecorator)} */ (function() { return this._handler; })}
});

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);

  /** @type {vs.directives.Visualization} */
  var vis = $scope['visualization']['handler'];
  var options = $attrs['vsOptions'] ? $scope.$eval($attrs['vsOptions']) : {};

  this._handler = this.createDecorator(
    {'$scope':$scope, '$element':$element, '$attrs':$attrs, 'taskService':this._taskService, '$timeout':this._$timeout},
    $element.parent(),
    vis['handler'],
    /** @type {Object.<string, *>} */ (options));

  if (!this._overridesVisHandler) {
    this._taskService.chain(this._handler['endDrawTask'], vis['handler']['endDrawTask']);
    this._taskService.chain(vis['handler']['beginDrawTask'], this._handler['beginDrawTask']);
  } else {
    this._taskService.chain(vis['handler']['endDrawTask'], this._handler['endDrawTask']);
    this._taskService.chain(this._handler['beginDrawTask'], vis['handler']['beginDrawTask']);
  }
};

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 */
vs.directives.GraphicDecorator.prototype.createDecorator = function($ng, $targetElement, target, options) { throw new u.AbstractMethodException(); };
