/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:08 AM
 */

goog.provide('vis.ui.Visualization');

goog.require('vis.models.DataSource');
goog.require('vis.ui.VisualizationOptions');

goog.require('vis.async.Task');
goog.require('goog.async.Deferred');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @constructor
 */
vis.ui.Visualization = function($scope, $element, $attrs) {
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

Object.defineProperties(vis.ui.Visualization.prototype, {
  scope: {
    get: function() { return this._scope; }
  },
  element: {
    get: function() { return this._element; }
  },
  attrs: {
    get: function() { return this._attrs; }
  },

  /**
   * @type {vis.models.VisualizationOptions}
   * @instance
   * @memberof vis.ui.Visualization
   */
  options: {
    get: function() { return this._scope.options; }
  },

  /**
   * @type {vis.models.DataSource}
   * @instance
   * @memberof vis.ui.Visualization
   */
  data: {
    get: function() { return this._scope.data; }
  },

  /**
   * @type {vis.async.Task}
   * @instance
   * @memberof vis.ui.Visualization
   */
  preDrawTask: {
    get: function() { return this._preDrawTask; }
  },

  /**
   * @type {vis.async.Task}
   * @instance
   * @memberof vis.ui.Visualization
   */
  drawTask: {
    get: function() { return this._drawTask; }
  }
});

/**
 */
vis.ui.Visualization.prototype.preDraw = function() {};

/**
 */
vis.ui.Visualization.prototype.draw = function() {};

/**
 * @returns {goog.async.Deferred}
 */
vis.ui.Visualization.prototype.doDraw = function() {
  var self = this;
  var deferred = new goog.async.Deferred();
  var taskService = this._scope.taskService;
  taskService.runChain(self.preDrawTask, true)
    .then(function() { return taskService.runChain(self.drawTask, true); })
    .then(function() { deferred.callback(); });

  return deferred;
};
