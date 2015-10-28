/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:08 AM
 */

goog.provide('vs.deprecated.ui.Visualization');

goog.require('vs.models.DataSource');
goog.require('vs.deprecated.ui.VisualizationOptions');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');
goog.require('goog.async.Deferred');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vs.async.TaskService} taskService
 * @param {vs.deprecated.ui.VisualizationOptions} options
 * @constructor
 */
vs.deprecated.ui.Visualization = function($scope, $element, $attrs, taskService, options) {
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
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vs.deprecated.ui.VisualizationOptions}
   * @private
   */
  this._options = options;

  var self = this;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._preDrawTask = this._taskService.createTask(function() { self.beginDraw(); });

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._drawTask = this._taskService.createTask(function() { self.draw(); });

  /**
   * @type {goog.async.Deferred}
   * @private
   */
  this._lastDraw = new goog.async.Deferred();
  this._lastDraw.callback();
};

Object.defineProperties(vs.deprecated.ui.Visualization.prototype, {
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
   * @type {vs.models.VisualizationOptions}
   * @instance
   * @memberof vs.deprecated.ui.Visualization
   */
  options: {
    get: function() { return this._options; }
  },

  /**
   * @type {vs.models.DataSource}
   * @instance
   * @memberof vs.deprecated.ui.Visualization
   */
  data: {
    get: function() { return this._options.data; }
  },

  /**
   * @type {vs.async.Task}
   * @instance
   * @memberof vs.deprecated.ui.Visualization
   */
  preDrawTask: {
    get: function() { return this._preDrawTask; }
  },

  /**
   * @type {vs.async.Task}
   * @instance
   * @memberof vs.deprecated.ui.Visualization
   */
  drawTask: {
    get: function() { return this._drawTask; }
  }
});

/**
 */
vs.deprecated.ui.Visualization.prototype.beginDraw = function() {};

/**
 */
vs.deprecated.ui.Visualization.prototype.draw = function() {};

/**
 * @returns {goog.async.Deferred}
 */
vs.deprecated.ui.Visualization.prototype.doDraw = function() {
  var self = this;
  var lastDraw = this._lastDraw;
  if (!lastDraw.hasFired()) { return lastDraw; }

  var deferred = new goog.async.Deferred();
  this._lastDraw = deferred;
  var taskService = this._taskService;

  // Since we chose to run draw tasks sequentially, there is no need to queue them using promises.
  // The beginDraw and draw must run one after the other, with no delay in between, so this is a temporary fix for that problem.
  // TODO: Create an entirely new chain, containing both the beginDraw and draw tasks and run that instead.
  /*lastDraw
    .then(function() { return taskService.runChain(self.preDrawTask); })
    .then(function() { return taskService.runChain(self.drawTask); })
    .then(function() { deferred.callback(); });*/

  taskService.runChain(self.preDrawTask, true);
  taskService.runChain(self.drawTask, true);
  deferred.callback();

  return deferred;
};
