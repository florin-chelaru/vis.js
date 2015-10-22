/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.provide('vs.models.DataSource');

goog.require('u.AbstractMethodException');
goog.require('vs.models.DataArray');
goog.require('vs.models.Query');

/**
 * @constructor
 */
vs.models.DataSource = function() {
  /**
   * @type {Object.<string, vs.models.DataArray>}
   * @private
   */
  this._valsMap = null;

  /**
   * @type {Object.<string, vs.models.DataArray>}
   * @private
   */
  this._rowsMap = null;

  /**
   * @type {Object.<string, vs.models.DataArray>}
   * @private
   */
  this._colsMap = null;
};

/**
 * @type {vs.models.Query}
 * @name vs.models.DataSource#query
 */
vs.models.DataSource.prototype.query;

/**
 * @type {number}
 * @name vs.models.DataSource#nrows
 */
vs.models.DataSource.prototype.nrows;

/**
 * @type {number}
 * @name vs.models.DataSource#ncols
 */
vs.models.DataSource.prototype.ncols;

/**
 * @type {Array.<vs.models.DataArray>}
 * @name vs.models.DataSource#rows
 */
vs.models.DataSource.prototype.rows;

/**
 * @type {Array.<vs.models.DataArray>}
 * @name vs.models.DataSource#cols
 */
vs.models.DataSource.prototype.cols;

/**
 * @type {Array.<vs.models.DataArray>}
 * @name vs.models.DataSource#vals
 */
vs.models.DataSource.prototype.vals;

/*Object.defineProperties(vs.models.DataSource.prototype, {
  /!**
   * @type {boolean}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  /!*dirty: {
    get: function() { throw new u.AbstractMethodException(); },
    set: function(value) { throw new u.AbstractMethodException(); }
  },*!/

  /!**
   * @type {vs.models.Query}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  query: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /!**
   * @type {number}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  nrows: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /!**
   * @type {number}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  ncols: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /!**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  rows: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /!**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  cols: {
    get: function() { throw new u.AbstractMethodException(); }
  },

  /!**
   * @type {Array.<vs.models.DataArray>}
   * @instance
   * @memberof vs.models.DataSource
   *!/
  vals: {
    get: function() { throw new u.AbstractMethodException(); }
  }
});*/

/**
 * @param {string} label
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getVals = function(label) {
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
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getRows = function(label) {
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
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getCols = function(label) {
  if (!this._colsMap) {
    var colsMap = {};
    this.cols.forEach(function(d) {
      colsMap[d.label] = d;
    });
    this._colsMap = colsMap;
  }

  return this._colsMap[label];
};
