/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:18 PM
 */

goog.provide('vs.ui.decorators.Grid');

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
vs.ui.decorators.Grid = function($ng, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);
};

goog.inherits(vs.ui.decorators.Grid, vs.ui.Decorator);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Grid.Settings = {
  'type': new vs.ui.Setting({'key':'type', 'type': vs.ui.Setting.Type['CATEGORICAL'], 'defaultValue': 'x', 'possibleValues': ['x', 'y']}),
  'ticks': new vs.ui.Setting({'key':'ticks', 'type': vs.ui.Setting.Type['NUMBER'], 'defaultValue': 10}),
  'format': new vs.ui.Setting({'key':'format', 'type': vs.ui.Setting.Type['STRING'], 'defaultValue': 's'})
};

/**
 * @type {string}
 * @name vs.ui.decorators.Grid#type
 */
vs.ui.decorators.Grid.prototype.type;

/**
 * @type {number}
 * @name vs.ui.decorators.Grid#ticks
 */
vs.ui.decorators.Grid.prototype.ticks;

/**
 * @type {string}
 * @name vs.ui.decorators.Grid#format
 */
vs.ui.decorators.Grid.prototype.format;

Object.defineProperties(vs.ui.decorators.Grid.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return vs.ui.decorators.Grid.Settings; })},
  'type': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return this.optionValue('type'); })},
  'ticks': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function () { return this.optionValue('ticks'); })},
  'format': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return this.optionValue('format'); })}
});
