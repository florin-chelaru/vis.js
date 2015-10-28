/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/22/2015
 * Time: 3:12 PM
 */

goog.provide('vs.ui.VisHandler');

goog.require('vs.models.DataSource');
goog.require('vs.ui.Setting');
// goog.require('vs.ui.VisOptions');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');
//goog.require('goog.async.Deferred');

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vs.async.TaskService} taskService
 * @param {Object.<string, *>} options
 * @param {vs.models.DataSource} data
 * @constructor
 */
vs.ui.VisHandler = function($scope, $element, $attrs, taskService, options, data) {
  /**
   * @private
   */
  this._$scope = $scope;

  /**
   * @private
   */
  this._$element = $element;

  /**
   * @private
   */
  this._$attrs = $attrs;

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = options;

  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = data;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._beginDrawTask = this._taskService.createTask(this.beginDraw, this);

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._endDrawTask = this._taskService.createTask(this.endDraw, this);

  /**
   * @type {Promise}
   * @private
   */
  this._lastDraw = Promise.resolve();

  /**
   * @type {boolean}
   * @private
   */
  this._lastDrawFired = true;
};

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.VisHandler.Settings = {
  'margins': vs.ui.Setting.PredefinedSettings['margins'],
  'width': vs.ui.Setting.PredefinedSettings['width'],
  'height': vs.ui.Setting.PredefinedSettings['height']
};

/**
 * Gets a list of all settings (option definitions) for this type of visualization
 * @type {Object.<string, vs.ui.Setting>}
 * @name vs.ui.VisHandler#settings
 */
vs.ui.VisHandler.prototype.settings;

/**
 * @name vs.ui.VisHandler#$scope
 */
vs.ui.VisHandler.prototype.$scope;

/**
 * @name vs.ui.VisHandler#$element
 */
vs.ui.VisHandler.prototype.$element;

/**
 * @name vs.ui.VisHandler#$attrs
 */
vs.ui.VisHandler.prototype.$attrs;

/**
 * The values for the visualization predefined settings
 * @type {Object.<string, *>}
 * @name vs.ui.VisHandler#options
 */
vs.ui.VisHandler.prototype.options;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.VisHandler#data
 */
vs.ui.VisHandler.prototype.data;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#beginDrawTask
 */
vs.ui.VisHandler.prototype.beginDrawTask;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#endDrawTask
 */
vs.ui.VisHandler.prototype.endDrawTask;

Object.defineProperties(vs.ui.VisHandler.prototype, {
  settings: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return vs.ui.VisHandler.Settings; })},
  $scope: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$scope; })},
  $element: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$element; })},
  $attrs: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$attrs; })},
  options: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._options; })},
  data: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._data; })},
  beginDrawTask: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._beginDrawTask; })},
  endDrawTask: { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._endDrawTask; })}
});

/**
 * @param {string} optionKey
 * @returns {*}
 */
vs.ui.VisHandler.prototype.optionValue = function(optionKey) {
  if (!(optionKey in this.settings)) { return null; }
  return this.settings[optionKey].getValue(this.options, this.$attrs, this.data, this.settings);
};

/**
 */
vs.ui.VisHandler.prototype.beginDraw = function() {};

/**
 */
vs.ui.VisHandler.prototype.endDraw = function() {};

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.draw = function() {
  var self = this;
  var lastDraw = this._lastDraw;
  if (!this._lastDrawFired) { return lastDraw; }

  this._lastDrawFired = false;
  var promise = new Promise(function(resolve, reject) {
    var taskService = self._taskService;

    // Since we chose to run draw tasks sequentially, there is no need to queue them using promises.
    // The beginDraw and draw must run one after the other, with no delay in between, so this is a temporary fix for that problem.
    // TODO: Create an entirely new chain, containing both the beginDraw and draw tasks and run that instead.
    /*lastDraw
     .then(function() { return taskService.runChain(self.beginDrawTask); })
     .then(function() { return taskService.runChain(self.endDrawTask); })
     .then(resolve);*/

    taskService.runChain(self.beginDrawTask, true);
    taskService.runChain(self.endDrawTask, true);
    self._lastDrawFired = true;
    resolve();
  });
  this._lastDraw = promise;
  return promise;
};
