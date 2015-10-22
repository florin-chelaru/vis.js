/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:39 PM
 */

goog.provide('vs.ui.Decorator');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');

/**
 * @param $scope
 * @param {jQuery} $element
 * @param $attrs
 * @param {vs.async.TaskService} taskService
 * @param {jQuery} $targetElement
 * @param {vs.ui.Visualization} target
 * @constructor
 * @abstract
 */
vs.ui.Decorator = function($scope, $element, $attrs, taskService, $targetElement, target) {
  /**
   * @private
   */
  this._scope = $scope;

  /**
   * @type {jQuery}
   * @private
   */
  this._element = $element;

  /**
   * @private
   */
  this._attrs = $attrs;

  /**
   * @type {jQuery}
   * @private
   */
  this._targetElement = $targetElement;

  /**
   * @type {vs.ui.Visualization}
   * @private
   */
  this._target = target;

  var self = this;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._preDrawTask = taskService.createTask(function() { self.preDraw(); });

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._drawTask = taskService.createTask(function() { self.draw(); });
};

Object.defineProperties(vs.ui.Decorator.prototype, {
  /**
   * @instance
   * @memberof vs.ui.Decorator
   */
  scope: {
    get: function() { return this._scope; }
  },

  /**
   * @instance
   * @memberof vs.ui.Decorator
   */
  element: {
    get: function() { return this._element; }
  },

  /**
   * @instance
   * @memberof vs.ui.Decorator
   */
  attrs: {
    get: function() { return this._attrs; }
  },

  /**
   * @instance
   * @memberof vs.ui.Decorator
   */
  targetElement: {
    get: function() { return this._targetElement; }
  },

  data: {
    get: function () { return this._target.data; }
  },

  visOptions: {
    get: function () { return this._target.options; }
  },

  visualization: {
    get: function () { return this._target; }
  },

  /**
   * @type {vs.async.Task}
   * @instance
   * @memberof vs.ui.Decorator
   */
  preDrawTask: {
    get: function() { return this._preDrawTask; }
  },

  /**
   * @type {vs.async.Task}
   * @instance
   * @memberof vs.ui.Decorator
   */
  drawTask: {
    get: function() { return this._drawTask; }
  }
});

vs.ui.Decorator.prototype.preDraw = function() { /* console.log('Decorator.preDraw'); */ };

vs.ui.Decorator.prototype.draw = function() { /* console.log('Decorator.draw'); */ };
