/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 2:26 PM
 */

goog.provide('vis.models.DataSourceWrapper');

goog.require('vis.models.DataArray');
goog.require('vis.models.DataSource');

/**
 * @param {vis.models.DataSource|*} data
 * @constructor
 * @extends vis.models.DataSource
 */
vis.models.DataSourceWrapper = function(data) {
  /**
   * @type {vis.models.DataSource}
   * @private
   */
  this._data = data;
};

goog.inherits(vis.models.DataSourceWrapper, vis.models.DataSource);

Object.defineProperties(vis.models.DataSourceWrapper.prototype, {
  /**
   * @type {boolean}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  dirty: {
    get: function() { return this._data.dirty; },
    set: function(value) { this._data.dirty = value; }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  nrows: {
    get: function() { return this._data.nrows; }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  ncols: {
    get: function() { return this._data.ncols; }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  rows: {
    get: function() { return this._data.rows; }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  cols: {
    get: function() { return this._data.cols; }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSourceWrapper
   */
  vals: {
    get: function() { return this._data.vals; }
  }
});
