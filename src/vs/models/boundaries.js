/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 12:35 PM
 */

goog.provide('vs.models.Boundaries');

/**
 * @param {number} min
 * @param {number} max
 * @constructor
 */
vs.models.Boundaries = function(min, max) {
  /**
   * @type {number}
   * @private
   */
  this._min = min;

  /**
   * @type {number}
   * @private
   */
  this._max = max;
};

/**
 * @type {number}
 * @name vs.models.Boundaries#min
 */
vs.models.Boundaries.prototype.min;

/**
 * @type {number}
 * @name vs.models.Boundaries#max
 */
vs.models.Boundaries.prototype.max;

Object.defineProperties(vs.models.Boundaries.prototype, {
  min: {
    get: /** @type {function (this:vs.models.Boundaries)} */ (function() { return this._min; }),
    set: /** @type {function (this:vs.models.Boundaries)} */ (function(value) { this._min = value; })
  },
  max: {
    get: /** @type {function (this:vs.models.Boundaries)} */ (function() { return this._max; }),
    set: /** @type {function (this:vs.models.Boundaries)} */ (function(value) { this._max = value; })
  }
});
