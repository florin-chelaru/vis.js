/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:39 PM
 */

goog.provide('vs.ui.Decorator');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');

/**
 * @param {{$scope: *, $element: jQuery, $attrs: *, $timeout: Function, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @abstract
 */
vs.ui.Decorator = function($ng, $targetElement, target, options) {
  /**
   * @private
   */
  this._$scope = $ng.$scope;

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = $ng.$element;

  /**
   * @private
   */
  this._$attrs = $ng.$attrs;

  /**
   * @type {Function}
   * @private
   */
  this._$timeout = $ng.$timeout;

  /**
   * @type {jQuery}
   * @private
   */
  this._$targetElement = $targetElement;

  /**
   * @type {vs.ui.VisHandler}
   * @private
   */
  this._target = target;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._beginDrawTask = $ng.taskService.createTask(this.beginDraw, this);

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._endDrawTask = $ng.taskService.createTask(this.endDraw, this);

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = options;
};

/**
 * @name vs.ui.Decorator#$scope
 */
vs.ui.Decorator.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.ui.Decorator#$element
 */
vs.ui.Decorator.prototype.$element;

/**
 * @name vs.ui.Decorator#$attrs
 */
vs.ui.Decorator.prototype.$attrs;

/**
 * @type {jQuery}
 * @name vs.ui.Decorator#$targetElement
 */
vs.ui.Decorator.prototype.$targetElement;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.Decorator#data
 */
vs.ui.Decorator.prototype.data;

/**
 * @type {vs.ui.VisHandler}
 * @name vs.ui.Decorator#target
 */
vs.ui.Decorator.prototype.target;

/**
 * @type {Object.<string, *>}
 * @name vs.ui.Decorator#options
 */
vs.ui.Decorator.prototype.options;

/**
 * @type {vs.async.Task}
 * @name vs.ui.Decorator#beginDrawTask
 */
vs.ui.Decorator.prototype.beginDrawTask;

/**
 * @type {vs.async.Task}
 * @name vs.ui.Decorator#endDrawTask
 */
vs.ui.Decorator.prototype.endDrawTask;

Object.defineProperties(vs.ui.Decorator.prototype, {
  $scope: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$scope; })},
  $element: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$element; })},
  $attrs: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$attrs; })},
  $targetElement: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$targetElement; })},
  data: { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._target.data; })},
  target: { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._target; })},
  options: { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._options; })},
  settings: { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return {}; })},
  beginDrawTask: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._beginDrawTask; })},
  endDrawTask: { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._endDrawTask; })}
});

/**
 * @param {string} optionKey
 * @returns {*}
 */
vs.ui.Decorator.prototype.optionValue = function(optionKey) {
  if (!(optionKey in this.settings)) { return null; }
  return this.settings[optionKey].getValue(this.options, this.$attrs, this.data, this.settings);
};

vs.ui.Decorator.prototype.beginDraw = function() { /*console.log('Decorator.beginDraw'); */return Promise.resolve(); };

vs.ui.Decorator.prototype.endDraw = function() { /*console.log('Decorator.endDraw'); */return Promise.resolve(); };
