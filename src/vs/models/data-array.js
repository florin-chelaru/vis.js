/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:17 PM
 */

goog.provide('vs.models.DataArray');
goog.require('vs.models.Boundaries');

/**
 * @interface
 */
vs.models.DataArray = function() {};

/**
 * @type {string}
 * @name vs.models.DataArray#label
 */
vs.models.DataArray.prototype.label;

/**
 * @type {Array}
 * @name vs.models.DataArray#d
 */
vs.models.DataArray.prototype.d;

/**
 * @type {vs.models.Boundaries}
 * @name vs.models.DataArray#boundaries
 */
vs.models.DataArray.prototype.boundaries;

/*Object.defineProperties(vs.models.DataArray.prototype, {
  label: { get: /!** @type {function (this:vs.ui.DataArray)} *!/ (function () { throw new u.AbstractMethodException(); })},
  d: { get: /!** @type {function (this:vs.ui.DataArray)} *!/ (function() { throw new u.AbstractMethodException(); })},
  boundaries: { get: /!** @type {function (this:vs.ui.DataArray)} *!/ (function() { throw new u.AbstractMethodException(); })}
});*/
