/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/8/2016
 * Time: 12:07 PM
 */

goog.provide('vs.ui.decorators.Brushing');

goog.require('vs.ui.BrushingEvent');
goog.require('vs.ui.Decorator');
goog.require('vs.ui.Setting');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Brushing = function($ng, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);

  /**
   * @type {u.Event.<vs.ui.BrushingEvent>}
   * @private
   */
  this._brushing = new u.Event();
};

goog.inherits(vs.ui.decorators.Brushing, vs.ui.Decorator);

/**
 * @type {u.Event.<vs.ui.BrushingEvent>}
 * @name vs.ui.decorators.Brushing#brushing
 */
vs.ui.decorators.Brushing.prototype.brushing;

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Brushing.Settings = {};

Object.defineProperties(vs.ui.decorators.Brushing.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.decorators.Brushing)} */ (function() { return vs.ui.decorators.Brushing.Settings; })},
  'brushing': { get: /** @type {function (this:vs.ui.decorators.Brushing)} */ (function() { return this._brushing; })}
});

/**
 * @param {vs.ui.BrushingEvent} e
 * @param {Array.<Object>} objects
 */
vs.ui.decorators.Brushing.prototype.brush = function(e, objects) {};
