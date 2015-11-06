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
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.GraphicDecorator = function($scope, taskService, $timeout) {
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
};

goog.inherits(vs.directives.GraphicDecorator, vs.directives.Directive);

Object.defineProperties(vs.directives.GraphicDecorator.prototype, {
  handler: { get: function() { return this._handler; }}
});

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link.post.apply(this, arguments);

  /** @type {vs.directives.Visualization} */
  var vis = $scope['visualization']['handler'];
  var options = $attrs['vsOptions'] ? $scope.$eval($attrs['vsOptions']) : {};

  this._handler = this.createDecorator({'$scope':$scope, '$element':$element, '$attrs':$attrs, taskService:this._taskService, $timeout:this._$timeout}, $element.parent(), vis.handler, options);

  this._taskService.chain(this._handler['endDrawTask'], vis.handler['endDrawTask']);
  this._taskService.chain(vis.handler['beginDrawTask'], this._handler['beginDrawTask']);
};

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 */
vs.directives.GraphicDecorator.prototype.createDecorator = function($ng, $targetElement, target, options) { throw new vs.AbstractMethodException(); };
