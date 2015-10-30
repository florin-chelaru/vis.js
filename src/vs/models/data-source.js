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

  /**
   * @type {u.Event.<vs.models.DataSource>}
   * @private
   */
  this._changed = null;

  /**
   * @type {Promise}
   * @private
   */
  this._ready = null;

  /**
   * @type {boolean|undefined}
   * @private
   */
  this._isReady = null;
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

/**
 * @type {Promise}
 * @name vs.models.DataSource#ready
 */
vs.models.DataSource.prototype.ready;

/**
 * @type {boolean}
 * @name vs.models.DataSource#isReady
 */
vs.models.DataSource.prototype.isReady;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.models.DataSource#changed
 */
vs.models.DataSource.prototype.changed;

Object.defineProperties(vs.models.DataSource.prototype, {
  changed: {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._changed) { this._changed = new u.Event(); }
      return this._changed;
    })
  },
  ready: {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._ready) { this._ready = Promise.resolve(this); }
      return this._ready;
    })
  },
  isReady: { get: /** @type {function (this:vs.models.DataSource)} */ (function() { return (this._isReady == undefined) ? true : this._isReady; })}
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} queries
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.models.DataSource.prototype.applyQuery = function(queries) {
  if (queries instanceof vs.models.Query) { queries = [queries]; }
  if (!queries || !queries.length) { return Promise.resolve(this); }

  var ret = this;
  return new Promise(function(resolve, reject) {
    u.async.each(queries, function(query) {
      return new Promise(function(itResolve, itReject) {
        vs.models.DataSource.singleQuery(ret, query)
          .then(function (data) { ret = data; itResolve(); }, itReject);
      });
    }, true)
      .then(function() { resolve(ret); }, reject);
  });
};

/**
 * @param {vs.models.DataSource} data
 * @param {vs.models.Query} q
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.models.DataSource.singleQuery = function(data, q) {
  if (!q) { return Promise.resolve(data); }
  var ret = data;
  return new Promise(function(resolve, reject) {
    try {
      /**
       * @type {vs.models.DataArray}
       */
      var targetArr = null;
      switch (q.target) {
        case vs.models.Query.Target.VALS:
          targetArr = ret.getVals(q.targetLabel);
          break;
        case vs.models.Query.Target.ROWS:
          targetArr = ret.getRow(q.targetLabel);
          break;
        case vs.models.Query.Target.COLS:
          targetArr = ret.getCol(q.targetLabel);
          break;
      }

      var indices = u.array.range(targetArr.d.length)
        .filter(function (i) {
          var test = true;
          var item = targetArr.d[i];

          try {
            switch (q.test) {
              case vs.models.Query.Test.EQUALS:
                test = (item == q.testArgs);
                break;
              case vs.models.Query.Test.GREATER_OR_EQUALS:
                test = (item >= q.testArgs);
                break;
              case vs.models.Query.Test.GREATER_THAN:
                test = (item > q.testArgs);
                break;
              case vs.models.Query.Test.LESS_OR_EQUALS:
                test = (item <= q.testArgs);
                break;
              case vs.models.Query.Test.LESS_THAN:
                test = (item < q.testArgs);
                break;
              case vs.models.Query.Test.CONTAINS:
                test = (item.indexOf(q.testArgs) >= 0);
                break;
              case vs.models.Query.Test.IN:
                test = (item in q.testArgs);
                break;
              default:
                test = false;
                break;
            }
          } catch (err) {
            test = false;
          }

          return (!q.negate && test) || (q.negate && !test);
        });

      switch (q.target) {
        case vs.models.Query.Target.ROWS:
          ret = u.reflection.wrap({
            query: ret.query.concat([q]),
            nrows: indices.length,
            ncols: ret.ncols,
            rows: ret.rows.map(function (arr) {
              return u.reflection.wrap({
                label: arr.label,
                boundaries: arr.boundaries,
                d: indices.map(function (i) {
                  return arr.d[i]
                })
              }, vs.models.DataArray);
            }),
            cols: ret.cols,
            vals: ret.vals.map(function (arr) {
              return u.reflection.wrap({
                label: arr.label,
                boundaries: arr.boundaries,
                d: ret.cols.map(function (col, j) {
                  return indices.map(function (i) {
                    return arr.d[j * ret.nrows + i];
                  })
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                })
              }, vs.models.DataArray);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target.COLS:
          ret = u.reflection.wrap({
            query: ret.query.concat([q]),
            nrows: ret.nrows,
            ncols: indices.length,
            rows: ret.rows,
            cols: ret.cols.map(function (arr) {
              return u.reflection.wrap({
                label: arr.label,
                boundaries: arr.boundaries,
                d: indices.map(function (i) {
                  return arr.d[i]
                })
              }, vs.models.DataArray);
            }),
            vals: ret.vals.map(function (arr) {
              return u.reflection.wrap({
                label: arr.label,
                boundaries: arr.boundaries,
                d: indices.map(function (i) {
                  return arr.d.slice(i * ret.nrows, (i + 1) * ret.nrows);
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                })
              }, vs.models.DataArray);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target.VALS:
          ret = u.reflection.wrap({
            query: ret.query.concat([q]),
            nrows: ret.nrows,
            ncols: ret.ncols,
            rows: ret.rows,
            cols: ret.cols,
            vals: ret.vals.map(function (arr) {
              var filtered = u.array.fill(arr.d.length, undefined);
              indices.forEach(function (i) {
                filtered[i] = arr.d[i];
              });
              return u.reflection.wrap({
                label: arr.label,
                boundaries: arr.boundaries,
                d: filtered
              }, vs.models.DataArray);
            })
          }, vs.models.DataSource);
          break;
      }

      resolve(ret);
    } catch (err) {
      reject(err);
    }
  });
};

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
