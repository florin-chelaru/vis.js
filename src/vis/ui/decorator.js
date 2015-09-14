/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:39 PM
 */

goog.provide('vis.ui.Decorator');

goog.require('vis.async.Task');
goog.require('vis.async.TaskService');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @constructor
 * @abstract
 */
vis.ui.Decorator = function($scope, $element, $attrs, $targetElement) {
  /**
   * @private
   */
  this._scope = $scope;

  /**
   * @private
   */
  this._element = $element;

  /**
   * @private
   */
  this._attrs = $attrs;

  /**
   * @private
   */
  this._targetElement = $targetElement;

  var self = this;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._preDrawTask = $scope.taskService.createTask(function() { self.preDraw(); });

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._drawTask = $scope.taskService.createTask(function() { self.draw(); });
};

Object.defineProperties(vis.ui.Decorator.prototype, {
  /**
   * @instance
   * @memberof vis.ui.Decorator
   */
  scope: {
    get: function() { return this._scope; }
  },

  /**
   * @instance
   * @memberof vis.ui.Decorator
   */
  element: {
    get: function() { return this._element; }
  },

  /**
   * @instance
   * @memberof vis.ui.Decorator
   */
  attrs: {
    get: function() { return this._attrs; }
  },

  /**
   * @instance
   * @memberof vis.ui.Decorator
   */
  targetElement: {
    get: function() { return this._targetElement; }
  },

  data: {
    get: function () { return this._scope.data; }
  },

  targetOptions: {
    get: function () { return this._scope.targetOptions; }
  },

  visualization: {
    get: function () { return this._scope.visualizationHandler; }
  },

  /**
   * @type {vis.async.Task}
   * @instance
   * @memberof vis.ui.Decorator
   */
  preDrawTask: {
    get: function() { return this._preDrawTask; }
  },

  /**
   * @type {vis.async.Task}
   * @instance
   * @memberof vis.ui.Decorator
   */
  drawTask: {
    get: function() { return this._drawTask; }
  }
});

vis.ui.Decorator.prototype.preDraw = function() {};

vis.ui.Decorator.prototype.draw = function() {};
