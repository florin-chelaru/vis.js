/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:42 PM
 */

goog.provide('vs.deprecated.models.RowDataItemWrapper');

goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItem');

/**
 * @param {vs.models.DataSource} dataSource
 * @param {number} i
 * @param {vs.ui.VisualizationOptions} options
 * @constructor
 * @implements vs.models.RowDataItem
 */
vs.deprecated.models.RowDataItemWrapper = function(dataSource, i, options) {
  /**
   * @type {vs.models.DataSource}
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
   * @type {vs.ui.VisualizationOptions}
   * @private
   */
  this._options = options;
};

goog.inherits(vs.deprecated.models.RowDataItemWrapper, vs.models.RowDataItem);

Object.defineProperties(vs.deprecated.models.RowDataItemWrapper.prototype, {
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
vs.deprecated.models.RowDataItemWrapper.prototype.row = function(index) {
  if (typeof index == 'number') {
    return this._dataSource.rows[index].d[this._i];
  }

  // else: string
  return this._dataSource.getRow(index).d[this._i];
};
