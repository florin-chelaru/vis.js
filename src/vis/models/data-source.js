/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.provide('vis.models.DataSource');

goog.require('u.AbstractMethodException');
goog.require('vis.models.DataArray');

/**
 * @abstract
 */
vis.models.DataSource = function() {
  /**
   * @type {Object.<string, vis.models.DataArray>}
   * @private
   */
  this._valsMap = null;

  /**
   * @type {Object.<string, vis.models.DataArray>}
   * @private
   */
  this._rowsMap = null;

  /**
   * @type {Object.<string, vis.models.DataArray>}
   * @private
   */
  this._colsMap = null;
};

Object.defineProperties(vis.models.DataSource.prototype, {
  /**
   * @type {boolean}
   * @instance
   * @memberof vis.models.DataSource
   */
  dirty: {
    get: function() { throw new u.AbstractMethodException(); },
    set: function(value) { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSource
   */
  nrows: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {number}
   * @instance
   * @memberof vis.models.DataSource
   */
  ncols: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSource
   */
  rows: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSource
   */
  cols: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /**
   * @type {Array.<vis.models.DataArray>}
   * @instance
   * @memberof vis.models.DataSource
   */
  vals: {
    get: function() { throw new u.AbstractMethodException(); }
  }
});

/**
 * @param {string} label
 * @returns {vis.models.DataArray}
 */
vis.models.DataSource.prototype.getVals = function(label) {
  if (!this._valsMap) {
    var valsMap = {};
    this.vals.forEach(function(d) {
      valsMap[d.label] = d;
    });
    this._valsMap = valsMap;
  }

  return this._valsMap[label];
};

/**
 * @param {string} label
 * @returns {vis.models.DataArray}
 */
vis.models.DataSource.prototype.getRows = function(label) {
  if (!this._rowsMap) {
    var rowsMap = {};
    this.rows.forEach(function(d) {
      rowsMap[d.label] = d;
    });
    this._rowsMap = rowsMap;
  }

  return this._rowsMap[label];
};

/**
 * @param {string} label
 * @returns {vis.models.DataArray}
 */
vis.models.DataSource.prototype.getCols = function(label) {
  if (!this._colsMap) {
    var colsMap = {};
    this.cols.forEach(function(d) {
      colsMap[d.label] = d;
    });
    this._colsMap = colsMap;
  }

  return this._colsMap[label];
};
