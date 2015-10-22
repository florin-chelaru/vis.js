/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 2:26 PM
 */

goog.provide('vs.models.DataSourceWrapper');

goog.require('vs.models.DataArray');
goog.require('vs.models.DataSource');

/**
 * TODO: Not needed! We can just use u.reflection.wrap!
 * @param {vs.models.DataSource|*} data
 * @constructor
 * @extends vs.models.DataSource
 */
vs.models.DataSourceWrapper = function(data) {
  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = data;
};

goog.inherits(vs.models.DataSourceWrapper, vs.models.DataSource);

Object.defineProperties(vs.models.DataSourceWrapper.prototype, {
  /**
   * @type {boolean}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  /*dirty: {
    get: function() { return this._data.dirty; },
    set: function(value) { this._data.dirty = value; }
  },*/

  /**
   * @type {number}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  nrows: {
    get: function() { return this._data.nrows; }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  ncols: {
    get: function() { return this._data.ncols; }
  },

  /**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  rows: {
    get: function() { return this._data.rows; }
  },

  /**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  cols: {
    get: function() { return this._data.cols; }
  },

  /**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSourceWrapper
   */
  vals: {
    get: function() { return this._data.vals; }
  }
});
