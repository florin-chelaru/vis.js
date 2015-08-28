/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:17 PM
 */

goog.provide('vis.models.DataArray');

/**
 * @interface
 */
vis.models.DataArray = function() {};

Object.defineProperties(vis.models.DataArray.prototype, {
  label: {
    /** @returns {string} */
    get: function () { throw new vis.AbstractMethodException(); }
  },
  d: {
    /** @retuns {Array} */
    get: function() { throw new vis.AbstractMethodException(); }
  }
});
