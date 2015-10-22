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

Object.defineProperties(vs.models.DataArray.prototype, {
  /**
   * @type {string}
   * @instance
   * @memberof vs.models.DataArray
   */
  label: {
    get: function () { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {Array}
   * @instance
   * @memberof vs.models.DataArray
   */
  d: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {vs.models.Boundaries}
   * @instance
   * @memberof vs.models.DataArray
   */
  boundaries: {
    get: function() { throw new u.AbstractMethodException(); }
  }
});
