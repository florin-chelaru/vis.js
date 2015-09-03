/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:17 PM
 */

goog.provide('vis.models.DataArray');

goog.require('vis.AbstractMethodException');
goog.require('vis.models.Boundaries');

/**
 * @interface
 */
vis.models.DataArray = function() {};

Object.defineProperties(vis.models.DataArray.prototype, {
  /**
   * @type {string}
   * @instance
   * @memberof vis.models.DataArray
   */
  label: {
    get: function () { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {Array}
   * @instance
   * @memberof vis.models.DataArray
   */
  d: {
    get: function() { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {vis.models.Boundaries}
   * @instance
   * @memberof vis.models.DataArray
   */
  boundaries: {
    get: function() { throw new vis.AbstractMethodException(); }
  }
});
