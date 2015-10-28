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
   * @type {Object.<string, number>}
   * @private
   */
  this._valsIndexMap = null;

  /**
   * @type {Object.<string, number>}
   * @private
   */
  this._rowsIndexMap = null;

  /**
   * @type {Object.<string, number>}
   * @private
   */
  this._colsIndexMap = null;
};

/**
 * @type {Array.<vs.models.Query>}
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
  this._calcValsMap();
  return this.vals[this._valsIndexMap[label]];
};

/**
 * @param {string} label
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getRow = function(label) {
  this._calcRowsMap();
  return this.rows[this._rowsIndexMap[label]];
};

/**
 * @param {string} label
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getCol = function(label) {
  this._calcColsMap();
  return this.cols[this._colsIndexMap[label]];
};

/**
 * @param {string} label
 * @returns {number}
 */
vs.models.DataSource.prototype.valsIndex = function(label) {
  this._calcValsMap();
  return this._valsIndexMap[label];
};

/**
 * @param {string} label
 * @returns {number}
 */
vs.models.DataSource.prototype.colIndex = function(label) {
  this._calcColsMap();
  return this._colsIndexMap[label];
};

/**
 * @param {string} label
 * @returns {number}
 */
vs.models.DataSource.prototype.rowIndex = function(label) {
  this._calcRowsMap();
  return this._rowsIndexMap[label];
};

/**
 * @private
 */
vs.models.DataSource.prototype._calcValsMap = function() {
  if (!this._valsIndexMap) {
    var map = {};
    this.vals.forEach(function(d, i) {
      map[d.label] = i;
    });
    this._valsIndexMap = map;
  }
};

/**
 * @private
 */
vs.models.DataSource.prototype._calcColsMap = function() {
  if (!this._colsIndexMap) {
    var map = {};
    this.cols.forEach(function(d, i) {
      map[d.label] = i;
    });
    this._colsIndexMap = map;
  }
};

/**
 * @private
 */
vs.models.DataSource.prototype._calcRowsMap = function() {
  if (!this._rowsIndexMap) {
    var map = {};
    this.rows.forEach(function(d, i) {
      map[d.label] = i;
    });
    this._rowsIndexMap = map;
  }
};
