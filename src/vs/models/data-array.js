/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:17 PM
 */

goog.provide('vs.models.DataArray');
goog.require('vs.models.Boundaries');

/**
 * @param {Array} d
 * @param {string} [label]
 * @param {vs.models.Boundaries} [boundaries]
 * @constructor
 */
vs.models.DataArray = function(d, label, boundaries) {
  /**
   * @type {Array}
   * @private
   */
  this._d = d;

  /**
   * @type {string|undefined}
   * @private
   */
  this._label = label;

  /**
   * @type {vs.models.Boundaries|undefined}
   * @private
   */
  this._boundaries = boundaries;
};

/**
 * @type {string|undefined}
 * @name vs.models.DataArray#label
 */
vs.models.DataArray.prototype.label;

/**
 * @type {Array}
 * @name vs.models.DataArray#d
 */
vs.models.DataArray.prototype.d;

/**
 * @type {vs.models.Boundaries|undefined}
 * @name vs.models.DataArray#boundaries
 */
vs.models.DataArray.prototype.boundaries;

Object.defineProperties(vs.models.DataArray.prototype, {
  'label': { get: /** @type {function (this:vs.models.DataArray)} */ (function () { return this._label; })},
  'd': { get: /** @type {function (this:vs.models.DataArray)} */ (function() { return this._d; })},
  'boundaries': { get: /** @type {function (this:vs.models.DataArray)} */ (function() { return this._boundaries; })}
});
