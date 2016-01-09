/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.provide('vs.models.DataSource');
goog.provide('vs.models.DataRow');

goog.require('vs.models.DataArray');
goog.require('vs.models.Query');

/**
 * @constructor
 */
vs.models.DataSource = function() {
  /**
   * @type {string|null}
   * @private
   */
  this._id = null;

  /**
   * @type {string|null}
   * @private
   */
  this._state = null;

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
   * @type {u.Event.<vs.models.DataSource>}
   * @private
   */
  this._changing = null;

  /**
   * @type {Promise}
   * @private
   */
  this._ready = null;

  /**
   * @type {boolean|null|undefined}
   * @private
   */
  this._isReady = null;

  /**
   * @type {Array.<vs.models.DataRow>}
   * @private
   */
  this._dataRowArray = null;

  /**
   * @type {u.EventListener.<vs.models.DataSource>}
   * @private
   */
  this._dataRowArrayChangedListener = null;
};

/**
 * @type {string}
 * @name vs.models.DataSource#id;
 */
vs.models.DataSource.prototype.id;

/**
 * Two data sources are identical if their id + state are identical
 * @type {string}
 * @name vs.models.DataSource#state
 */
vs.models.DataSource.prototype.state;

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

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.models.DataSource#changing
 */
vs.models.DataSource.prototype.changing;

Object.defineProperties(vs.models.DataSource.prototype, {
  'id': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._id) { this._id = u.generatePseudoGUID(6); }
      return this._id;
    })
  },
  'state': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._state) {
        this._state = u.generatePseudoGUID(6);
        this['changing'].addListener(function() {
          this._state = u.generatePseudoGUID(6);
        }, this);
      }
      return this._state;
    })
  },
  'changed': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._changed) { this._changed = new u.Event(); }
      return this._changed;
    })
  },
  'changing': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._changing) { this._changing = new u.Event(); }
      return this._changing;
    })
  },
  'ready': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._ready) { this._ready = Promise.resolve(this); }
      return this._ready;
    })
  },
  'isReady': { get: /** @type {function (this:vs.models.DataSource)} */ (function() { return (this._isReady == undefined) ? true : this._isReady; })}
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} queries
 * @param {boolean} [copy] True if the result should be a copy instead of changing the current instance
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.models.DataSource.prototype.applyQuery = function(queries, copy) {
  if (queries instanceof vs.models.Query) { queries = [queries]; }
  if (!queries || !queries.length) { return /** @type {Promise} */ (Promise.resolve(this)); }

  var self = this;
  var ret = this;
  return new Promise(function(resolve, reject) {
    self['ready'].then(function() {
      u.async.each(queries, function(query) {
        return new Promise(function(itResolve, itReject) {
          vs.models.DataSource.singleQuery(ret, query)
            .then(function (data) { ret = data; itResolve(); }, itReject);
        });
      }, true)
        .then(function() {
          if (copy) { resolve(ret); }
          else {
            self['query'] = ret['query'];
            self['nrows'] = ret['nrows'];
            self['ncols'] = ret['ncols'];
            self['rows'] = ret['rows'];
            self['cols'] = ret['cols'];
            self['vals'] = ret['vals'];
            resolve(self);
            self['changed'].fire(self);
          }
        }, reject);
    }, reject);
  });
};

/**
 * For a static data source (that does not change over time), this does the exact same thing as applyQuery; for dynamic
 * data sources this simply filters out data already loaded in memory, without making any external calls.
 * @param {vs.models.Query|Array.<vs.models.Query>} queries
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.models.DataSource.prototype.filter = function(queries) {
  return vs.models.DataSource.prototype.applyQuery.call(this, queries, true);
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
      switch (q['target']) {
        case vs.models.Query.Target['VALS']:
          targetArr = q['targetLabel'] != undefined ? ret.getVals(q['targetLabel']) : new vs.models.DataArray(u.array.range(ret.nrows * ret.ncols));
          break;
        case vs.models.Query.Target['ROWS']:
          targetArr = q['targetLabel'] != undefined ? ret.getRow(q['targetLabel']) : new vs.models.DataArray(u.array.range(ret.nrows));
          break;
        case vs.models.Query.Target['COLS']:
          targetArr = q['targetLabel'] != undefined ? ret.getCol(q['targetLabel']) : new vs.models.DataArray(u.array.range(ret.ncols));
          break;
      }

      /** @type {Array.<number>} */
      var initialIndices = q['targetLabel'] != undefined ? u.array.range(targetArr['d'].length) : targetArr['d'];
      var indices = initialIndices
        .filter(function (i) {
          var test = true;
          var item = targetArr['d'][i];

          try {
            switch (q['test']) {
              case vs.models.Query.Test['EQUALS']:
                test = (item == q['testArgs']);
                break;
              case vs.models.Query.Test['GREATER_OR_EQUALS']:
                test = (item >= q['testArgs']);
                break;
              case vs.models.Query.Test['GREATER_THAN']:
                test = (item > q['testArgs']);
                break;
              case vs.models.Query.Test['LESS_OR_EQUALS']:
                test = (item <= q['testArgs']);
                break;
              case vs.models.Query.Test['LESS_THAN']:
                test = (item < q['testArgs']);
                break;
              case vs.models.Query.Test['CONTAINS']:
                test = (item.indexOf(q['testArgs']) >= 0);
                break;
              case vs.models.Query.Test['IN']:
                test = (item in q['testArgs']);
                break;
              default:
                test = false;
                break;
            }
          } catch (err) {
            test = false;
          }

          return (!q['negate'] && test) || (q['negate'] && !test);
        });

      switch (q['target']) {
        case vs.models.Query.Target['ROWS']:
          ret = u.reflection.wrap({
            'query': ret['query'].concat([q]),
            'nrows': indices.length,
            'ncols': ret['ncols'],
            'rows': ret['rows'].map(function (arr) {
              return new vs.models.DataArray(
                indices.map(function (i) {
                  return arr['d'][i]
                }),
                arr['label'],
                arr['boundaries']);
            }),
            'cols': ret['cols'],
            'vals': ret['vals'].map(function (arr) {
              return new vs.models.DataArray(
                u.array.range(ret['ncols']).map(function (j) {
                  return indices.map(function (i) {
                    return arr['d'][j * ret['nrows'] + i];
                  })
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                }),
                arr['label'],
                arr['boundaries']);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target['COLS']:
          ret = u.reflection.wrap({
            'query': ret['query'].concat([q]),
            'nrows': ret['nrows'],
            'ncols': indices.length,
            'rows': ret['rows'],
            'cols': ret['cols'].map(function (arr) {
              return new vs.models.DataArray(
                indices.map(function (i) {
                  return arr['d'][i]
                }),
                arr['label'],
                arr['boundaries']);
            }),
            'vals': ret['vals'].map(function (arr) {
              return new vs.models.DataArray(
                indices.map(function (i) {
                  return arr['d'].slice(i * ret['nrows'], (i + 1) * ret['nrows']);
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                }),
                arr['label'],
                arr['boundaries']);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target['VALS']:
          ret = u.reflection.wrap({
            'query': ret['query'].concat([q]),
            'nrows': ret['nrows'],
            'ncols': ret['ncols'],
            'rows': ret['rows'],
            'cols': ret['cols'],
            'vals': ret['vals'].map(function (arr) {
              var filtered = u.array.fill(arr['d'].length, undefined);
              indices.forEach(function (i) {
                filtered[i] = arr['d'][i];
              });
              return new vs.models.DataArray(filtered, arr['label'], arr['boundaries']);
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
  return this['vals'][this._valsIndexMap[label]];
};

/**
 * @param {string} label
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getRow = function(label) {
  this._calcRowsMap();
  return this['rows'][this._rowsIndexMap[label]];
};

/**
 * @param {string} label
 * @returns {vs.models.DataArray}
 */
vs.models.DataSource.prototype.getCol = function(label) {
  this._calcColsMap();
  return this['cols'][this._colsIndexMap[label]];
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
    this['vals'].forEach(function(d, i) {
      map[d['label']] = i;
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
    this['cols'].forEach(function(d, i) {
      map[d['label']] = i;
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
    this['rows'].forEach(function(d, i) {
      map[d['label']] = i;
    });
    this._rowsIndexMap = map;
  }
};

/**
 * @returns {{query: *, nrows: *, ncols: *, rows: *, cols: *, vals: *, isReady: *}}
 */
vs.models.DataSource.prototype.raw = function() {
  return {
    'query': this['query'],
    'nrows': this['nrows'],
    'ncols': this['ncols'],
    'rows': this['rows'],
    'cols': this['cols'],
    'vals': this['vals'],
    'isReady': this['isReady']
  };
};

/**
 * @returns {Array.<vs.models.DataRow>}
 */
vs.models.DataSource.prototype.asDataRowArray = function() {
  if (this._dataRowArrayChangedListener == undefined) {
    this._dataRowArrayChangedListener = this['changed'].addListener(function() { this._dataRowArray = null; }, this);
  }
  if (this._dataRowArray == undefined) {
    var self = this;
    this._dataRowArray = u.array.range(this['nrows']).map(function(i) { return new vs.models.DataRow(self, i); });
  }

  return this._dataRowArray;
};

/**
 * @param {number} i
 * @returns {string}
 */
vs.models.DataSource.prototype.key = function(i) {
  return '' + this['id'] + this['state'] + i;
};

/**
 * @param {vs.models.DataRow} d
 * @param {number} [i]
 * @returns {string}
 */
vs.models.DataSource.key = function(d, i) {
  return d['data'].key(d['index']);
};

/**
 * @param {vs.models.DataSource} data
 * @param {number} index
 * @constructor
 */
vs.models.DataRow = function(data, index) {
  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = data;

  /**
   * @type {number}
   * @private
   */
  this._index = index;
};

/**
 * @type {number}
 * @name vs.models.DataRow#index
 */
vs.models.DataRow.prototype.index;

/**
 * @type {vs.models.DataSource}
 * @name vs.models.DataRow#data
 */
vs.models.DataRow.prototype.data;

Object.defineProperties(vs.models.DataRow.prototype, {
  'index': { get: /** @type {function (this:vs.models.DataRow)} */ (function() { return this._index; })},
  'data': { get: /** @type {function (this:vs.models.DataRow)} */ (function() { return this._data; })}
});

/**
 * @param {string|number} colIndexOrLabel
 * @param {string} [valsLabel]
 * @returns {number}
 */
vs.models.DataRow.prototype.val = function(colIndexOrLabel, valsLabel) {
  /**
   * @type {vs.models.DataArray}
   */
  var vals = valsLabel ? this['data'].getVals(valsLabel) : this['data']['vals'][0];

  var index = (typeof colIndexOrLabel == 'number') ? colIndexOrLabel : this['data'].colIndex(colIndexOrLabel);

  return vals['d'][index * this['data']['nrows'] + this['index']];
};

/**
 * @param label
 * @returns {*}
 */
vs.models.DataRow.prototype.info = function(label) {
  var arr = this['data'].getRow(label);
  if (!arr) { return undefined; }
  return arr['d'][this['index']];
};

