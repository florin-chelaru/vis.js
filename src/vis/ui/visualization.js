/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:08 AM
 */

goog.provide('vis.ui.Visualization');

goog.require('vis.models.DataSource');
goog.require('vis.ui.VisualizationOptions');

goog.require('vis.async.Task');
goog.require('vis.async.TaskService');
goog.require('goog.async.Deferred');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vis.async.TaskService} taskService
 * @param {vis.ui.VisualizationOptions} options
 * @constructor
 */
vis.ui.Visualization = function($scope, $element, $attrs, taskService, options) {
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
   * @type {vis.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vis.ui.VisualizationOptions}
   * @private
   */
  this._options = options;

  var self = this;

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._preDrawTask = this._taskService.createTask(function() { self.preDraw(); });

  /**
   * @type {vis.async.Task}
   * @private
   */
  this._drawTask = this._taskService.createTask(function() { self.draw(); });
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
    get: function() { return this._options; }
  },

  /**
   * @type {vis.models.DataSource}
   * @instance
   * @memberof vis.ui.Visualization
   */
  data: {
    get: function() { return this._options.data; }
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
  var taskService = this._taskService;

  // Since we chose to run draw tasks sequentially, there is no need to queue them using promises.
  // The preDraw and draw must run one after the other, with no delay in between, so this is a temporary fix for that problem.
  // TODO: Create an entirely new chain, containing both the preDraw and draw tasks and run that instead.
  /*taskService.runChain(self.preDrawTask, true)
    .then(function() { return taskService.runChain(self.drawTask, true); })
    .then(function() { deferred.callback(); });*/

  taskService.runChain(self.preDrawTask, true);
  taskService.runChain(self.drawTask, true);
  deferred.callback();

  return deferred;
};
