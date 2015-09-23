/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:42 PM
 */

goog.provide('vis.models.RowDataItemWrapper');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItem');

/**
 * @param {vis.models.DataSource} dataSource
 * @param {number} i
 * @param {vis.ui.VisualizationOptions} options
 * @constructor
 * @implements vis.models.RowDataItem
 */
vis.models.RowDataItemWrapper = function(dataSource, i, options) {
  /**
   * @type {vis.models.DataSource}
   * @private
   */
  this._dataSource = dataSource;

  /**
   * @type {number}
   * @private
   */
  this._i = i;

  /**
   * @type {Array.<{label: string, d: *}>}
   * @private
   */
  this._data = null;

  /**
   * @type {Array.<number>}
   * @private
   */
  this._vals = null;

  /**
   * @type {Array}
   * @private
   */
  this._row = null;

  /**
   * @type {vis.ui.VisualizationOptions}
   * @private
   */
  this._options = options;
};

goog.inherits(vis.models.RowDataItemWrapper, vis.models.RowDataItem);

Object.defineProperties(vis.models.RowDataItemWrapper.prototype, {
  index: {
    /** @returns {number} */
    get: function() { return this._i; }
  },
  data: {
    /** @returns {Array.<{label: string, d: *}>} */
    get: function() {
      if (!this._data) {
        var data = [];
        for (var i = 0; i < this._dataSource.ncols; ++i) {
          data.push(this._dataSource.rows[i].d[this._i]);
        }
        this._data = data;
      }
      return this._data;
    }
  },
  vals: {
    /** @returns {Array.<number>} */
    get: function() {
      if (!this._vals) {
        var valsSeries = this._dataSource.getVals(this._options.vals);
        var vals = [];
        // TODO: Later introduce cols filter
        var j = this._i * this._dataSource.ncols;
        for (var i = 0; i < this._dataSource.ncols; ++i) {
          vals.push(valsSeries.d[j + i]);
        }
        this._vals = vals;
      }
      return this._vals;
    }
  }
});

/**
 * @param index
 * @returns {*}
 */
vis.models.RowDataItemWrapper.prototype.row = function(index) {
  if (typeof index == 'number') {
    return this._dataSource.rows[index].d[this._i];
  }

  // else: string
  return this._dataSource.getRows(index).d[this._i];
};
