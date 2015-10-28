/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 3:43 PM
 */

goog.provide('vs.ui.DataContext');

goog.require('vs.models.DataSource');
goog.require('vs.ui.VisualContext');
goog.require('vs.models.Query');

/**
 * @param {vs.ui.DataContext|{data: vs.models.DataSource, visualizations: (Array.<vs.ui.VisualContext>|undefined), children: (Array.<vs.ui.DataContext>|undefined), name: (string|undefined)}} options
 * @constructor
 */
vs.ui.DataContext = function(options) {
  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = options.data;

  /**
   * @type {Array.<vs.ui.VisualContext>}
   * @private
   */
  this._visualizations = options.visualizations || [];

  /**
   * @type {Array.<vs.ui.DataContext>}
   * @private
   */
  this._children = options.children || [];

  /**
   * @type {string}
   * @private
   */
  this._name = options.name || '';

  /**
   * @type {u.Event.<vs.models.DataSource>}
   */
  this._dataChanged = (options instanceof vs.ui.DataContext) ? options._dataChanged : null;
};

/**
 * @type {string}
 * @name vs.ui.DataContext#name
 */
vs.ui.DataContext.prototype.name;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.DataContext#data
 */
vs.ui.DataContext.prototype.data;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.ui.DataContext#dataChanged
 */
vs.ui.DataContext.prototype.dataChanged;

/**
 * @type {Array.<vs.ui.DataContext>}
 * @name vs.ui.DataContext#children
 */
vs.ui.DataContext.prototype.children;

/**
 * @type {Array.<vs.ui.VisualContext>}
 * @name vs.ui.DataContext#visualizations
 */
vs.ui.DataContext.prototype.visualizations;

Object.defineProperties(vs.ui.DataContext.prototype, {
  name: { get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._name; }) },

  data: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._data; }),
    set: /** @type {function (this:vs.ui.DataContext)} */ (function(value) { this._data = value; })
  },

  dataChanged: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() {
      if (!this._dataChanged) { this._dataChanged = new u.Event(); }
      return this._dataChanged;
    })
  },

  children: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._children; })
  },

  visualizations: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._visualizations; })
  }
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} queries
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.ui.DataContext.prototype.query = function(queries) {
  if (queries instanceof vs.models.Query) { queries = [queries]; }
  if (!queries || !queries.length) { return Promise.resolve(this.data); }

  var ret = this.data;
  return new Promise(function(resolve, reject) {
    u.async.each(queries, function(query) {
      return new Promise(function(itResolve, itReject) {
        vs.ui.DataContext.singleQuery(ret, query)
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
vs.ui.DataContext.singleQuery = function(data, q) {
  if (!q) { return Promise.resolve(dd); }
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
