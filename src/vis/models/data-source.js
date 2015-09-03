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
  /**
   * @type {boolean}
   * @instance
   * @memberof vis.models.DataSource
   */
  dirty: {
    get: function() { throw new vis.AbstractMethodException(); },
    set: function(value) { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSource
   */
  nrows: {
    get: function() { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSource
   */
  ncols: {
    get: function() { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSource
   */
  rows: {
    get: function() { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSource
   */
  cols: {
    get: function() { throw new vis.AbstractMethodException(); }
  },

  /**
   * @type {vis.models.DataArray}
   * @instance
   * @memberof vis.models.DataSource
   */
  vals: {
    get: function() { throw new vis.AbstractMethodException(); }
  }
});
