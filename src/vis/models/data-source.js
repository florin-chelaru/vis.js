/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.provide('vis.models.DataSource');

goog.require('vis.AbstractMethodException');
goog.require('vis.models.DataArray');

/**
 * @interface
 */
vis.models.DataSource = function() {};

Object.defineProperties(vis.models.DataSource.prototype, {
  dirty: {
    /** @returns {boolean} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  nrows: {
    /** @returns {number} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  ncols: {
    /** @returns {number} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  rows: {
    /** @returns {Array.<vis.models.DataArray>} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  cols: {
    /** @returns {Array.<vis.models.DataArray>} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  vals: {
    /** @returns {Array.<vis.models.DataArray>} */
    get: function() { throw new vis.AbstractMethodException(); }
  }
});
