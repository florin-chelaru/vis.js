/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:17 PM
 */

goog.provide('vs.ui.decorators.Axis');

goog.require('vs.ui.Decorator');
goog.require('vs.ui.Setting');


/**
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Axis = function() {
  vs.ui.Decorator.apply(this, arguments);
};

goog.inherits(vs.ui.decorators.Axis, vs.ui.Decorator);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Axis.Settings = {
  'type': new vs.ui.Setting({key:'type', type: vs.ui.Setting.Type.CATEGORICAL, defaultValue: 'x', possibleValues: ['x', 'y']}),
  'ticks': new vs.ui.Setting({key:'ticks', type: vs.ui.Setting.Type.NUMBER, defaultValue: 10}),
  'format': new vs.ui.Setting({key:'format', type: vs.ui.Setting.Type.STRING, defaultValue: 's'})
};

/**
 * @type {{x: string, y: string}}
 */
vs.ui.decorators.Axis.Orientation = {
  x: 'bottom',
  y: 'left'
};

/**
 * @type {string}
 * @name vs.ui.decorators.Axis#type
 */
vs.ui.decorators.Axis.prototype.type;

/**
 * @type {number}
 * @name vs.ui.decorators.Axis#ticks
 */
vs.ui.decorators.Axis.prototype.ticks;

/**
 * @type {string}
 * @name vs.ui.decorators.Axis#format
 */
vs.ui.decorators.Axis.prototype.format;

Object.defineProperties(vs.ui.decorators.Axis.prototype, {
  settings: { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return vs.ui.decorators.Axis.Settings; })},
  type: { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return this.optionValue('type'); })},
  ticks: { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function () { return this.optionValue('ticks'); })},
  format: { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return this.optionValue('format'); })}
});
