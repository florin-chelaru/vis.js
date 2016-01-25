/**
* @license vis.js
* Copyright (c) 2015 Florin Chelaru
* License: MIT
*
* Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
* documentation files (the "Software"), to deal in the Software without restriction, including without limitation the
* rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to
* permit persons to whom the Software is furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the
* Software.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
* WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
* COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
* OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/


goog.provide('vs.directives.Directive');

/**
 * @param {angular.Scope} $scope Angular scope
 * @constructor
 */
vs.directives.Directive = function($scope) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $scope;

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = null;

  /**
   * @private
   */
  this._$attrs = null;
};

/**
 * @type {angular.Scope}
 * @name vs.directives.Directive#$scope
 */
vs.directives.Directive.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.directives.Directive#$element
 */
vs.directives.Directive.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name vs.directives.Directive#$attrs
 */
vs.directives.Directive.prototype.$attrs;

Object.defineProperties(vs.directives.Directive.prototype, {
  '$scope': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$attrs; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Directive.prototype.link = {

  'pre': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  },

  'post': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  }
};

/**
 * @param {string} name
 * @param {function(new: vs.directives.Directive)} controllerCtor
 * @param {Array} [args]
 * @param {Object.<string, *>} [options]
 * @returns {{controller: (Array|Function), link: Function, restrict: string, transclude: boolean, replace: boolean}}
 */
vs.directives.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(args || []);
    params.unshift($scope);

    // Usage of 'this' is correct in this scope: we are accessing the 'this' of the controller
    this['handler'] = u.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if (typeof controllerCtor.prototype.link == 'function') {
    link = function ($scope, $element, $attrs) {
      var ctrl = $scope[name];
      return ctrl['handler'].link($scope, $element, $attrs, ctrl);
    };
  } else {
    link = {};
    if ('pre' in controllerCtor.prototype.link) {
      link['pre'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['pre'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
    if ('post' in controllerCtor.prototype.link) {
      link['post'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['post'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
  }

  return u.extend({}, options, { 'link': link, 'controller': controller, 'controllerAs': name });
};


goog.provide('vs.models.Boundaries');

/**
 * @param {number} [min]
 * @param {number} [max]
 * @constructor
 */
vs.models.Boundaries = function(min, max) {
  /**
   * @type {number}
   */
  this['min'] = min;

  /**
   * @type {number}
   */
  this['max'] = max;
};


goog.provide('vs.models.DataArray');
goog.require('vs.models.Boundaries');

/**
 * @param {Array} d
 * @param {string} [label]
 * @param {vs.models.Boundaries} [boundaries]
 * @constructor
 */
vs.models.DataArray = function(d, label, boundaries) {
  /**
   * @type {Array}
   * @private
   */
  this._d = d;

  /**
   * @type {string|undefined}
   * @private
   */
  this._label = label;

  /**
   * @type {vs.models.Boundaries|undefined}
   * @private
   */
  this._boundaries = boundaries;
};

/**
 * @type {string|undefined}
 * @name vs.models.DataArray#label
 */
vs.models.DataArray.prototype.label;

/**
 * @type {Array}
 * @name vs.models.DataArray#d
 */
vs.models.DataArray.prototype.d;

/**
 * @type {vs.models.Boundaries|undefined}
 * @name vs.models.DataArray#boundaries
 */
vs.models.DataArray.prototype.boundaries;

Object.defineProperties(vs.models.DataArray.prototype, {
  'label': { get: /** @type {function (this:vs.models.DataArray)} */ (function () { return this._label; })},
  'd': { get: /** @type {function (this:vs.models.DataArray)} */ (function() { return this._d; })},
  'boundaries': { get: /** @type {function (this:vs.models.DataArray)} */ (function() { return this._boundaries; })}
});


goog.provide('vs.models.Query');

/**
 * Argument details:
 *  - target: rows, columns or values
 *  - targetLabel: if defined, the label of the row/column/value array to test; if undefined, the index within the current structure is used
 *  - test: the filter to be applied on the data (>, <, ==, etc)
 *  - testArgs: arguments to test against
 *  - negate: take the complement of the result
 * @param {({target: string, targetLabel: (string|undefined), test: string, testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} opts
 * @constructor
 */
vs.models.Query = function(opts) {
  /**
   * @type {vs.models.Query.Target}
   */
  this['target'] = opts['target'];

  /**
   * @type {string}
   */
  this['targetLabel'] = opts['targetLabel'];

  /**
   * @type {vs.models.Query.Test}
   */
  this['test'] = opts['test'];

  /**
   * @type {*}
   */
  this['testArgs'] = opts['testArgs'];

  /**
   * @type {boolean}
   */
  this['negate'] = !!opts['negate'];
};

/**
 * @returns {string}
 */
vs.models.Query.prototype.toString = function() {
  var argsStr = (this['testArgs'] === undefined) ? 'undefined' : JSON.stringify(this['testArgs']);
  var ret =
      this['target'] + '.' +
      this['targetLabel'] + ' ' +
      this['test'] + ' ' +
      argsStr;
  return this['negate'] ? 'not(' + ret + ')' : ret;
};

/**
 * @param {({target: string, targetLabel: (string|undefined), test: string, testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} [other]
 * @returns {boolean}
 */
vs.models.Query.prototype.equals = function(other) {
  if (!other) { return false; }
  var q = new vs.models.Query(/** @type {({target: string, targetLabel: (string|undefined), test: string, testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} */ (other));
  return this.toString() == q.toString();
};

/**
 * @enum {string}
 */
vs.models.Query.Target = {
  'ROWS': 'rows',
  'COLS': 'cols',
  'VALS': 'vals'
};

/**
 * @enum {string}
 */
vs.models.Query.Test = {
  'EQUALS': '==',
  'GREATER_THAN': '>',
  'LESS_THAN': '<',
  'GREATER_OR_EQUALS': '>=',
  'LESS_OR_EQUALS': '<=',
  'CONTAINS': 'contains',
  'IN': 'in'
};


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



goog.provide('vs.ui.VisualContext');

/**
 * @param {{render: string, type: string}} construct
 * @param {Object.<string, *>} [options]
 * @param {{cls: Array.<string>, elem: Array.<{cls: string, options: Object.<string, *>}>}} [decorators]
 * @constructor
 */
vs.ui.VisualContext = function(construct, options, decorators) {
  /**
   * @type {{render: string, type: string}}
   */
  this['construct'] = construct;

  /**
   * @type {Object.<string, *>}
   */
  this['options'] = options || {};

  /**
   * @type {{cls: Array.<string>, elem: Array.<{cls: string, options: Object.<string, *>}>}|Array}
   */
  this['decorators'] = decorators || [];
};


goog.provide('vs.ui.DataHandler');

goog.require('vs.models.DataSource');
goog.require('vs.ui.VisualContext');
goog.require('vs.models.Query');

/**
 * @param {vs.ui.DataHandler|{data: vs.models.DataSource, visualizations: (Array.<vs.ui.VisualContext>|undefined), children: (Array.<vs.ui.DataHandler>|undefined), name: (string|undefined)}} options
 * @constructor
 */
vs.ui.DataHandler = function(options) {
  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = options['data'];

  /**
   * @type {Array.<vs.ui.VisualContext>}
   * @private
   */
  this._visualizations = options['visualizations'] || [];

  /**
   * @type {Array.<vs.ui.DataHandler>}
   * @private
   */
  this._children = options['children'] || [];

  /**
   * @type {string}
   * @private
   */
  this._name = options['name'] || '';
};

/**
 * @type {string}
 * @name vs.ui.DataHandler#name
 */
vs.ui.DataHandler.prototype.name;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.DataHandler#data
 */
vs.ui.DataHandler.prototype.data;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.ui.DataHandler#dataChanged
 */
vs.ui.DataHandler.prototype.dataChanged;

/**
 * @type {Array.<vs.ui.DataHandler>}
 * @name vs.ui.DataHandler#children
 */
vs.ui.DataHandler.prototype.children;

/**
 * @type {Array.<vs.ui.VisualContext>}
 * @name vs.ui.DataHandler#visualizations
 */
vs.ui.DataHandler.prototype.visualizations;

Object.defineProperties(vs.ui.DataHandler.prototype, {
  'name': { get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._name; }) },

  'data': {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._data; }),
    set: /** @type {function (this:vs.ui.DataHandler)} */ (function(value) { this._data = value; })
  },

  'dataChanged': { get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this['data']['changed']; })},

  'children': {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._children; })
  },

  'visualizations': {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._visualizations; })
  }
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} queries
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.ui.DataHandler.prototype.query = function(queries) {
  return this.data.applyQuery(queries);
};


goog.provide('vs.directives.DataContext');

goog.require('vs.directives.Directive');
goog.require('vs.ui.DataHandler');

/**
 * @param {angular.Scope} $scope
 * @param {angular.$templateCache} $templateCache
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.DataContext = function($scope, $templateCache) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular template service
   * @type {angular.$templateCache}
   * @private
   */
  this._$templateCache = $templateCache;

  /**
   * @type {vs.ui.DataHandler}
   * @private
   */
  this._handler = null;

  for (var key in $scope) {
    if (!$scope.hasOwnProperty(key)) { continue; }
    if ($scope[key] instanceof vs.ui.DataHandler) {
      this._handler = $scope[key];
      break;
    }
  }

  if (!this._handler) { throw new vs.ui.UiException('No vs.ui.DataHandler instance found in current scope'); }
  $scope['dataHandler'] = this._handler;

  /**
   * @type {string|null}
   * @private
   */
  this._template = null;

  var visCtxtFmt = '<div vs-context="dataHandler.visualizations[%s]" vs-data="dataHandler.data" class="visualization %s"></div>';
  var decoratorFmt = '<div class="%s" vs-options="dataHandler.visualizations[%s].decorators.elem[%s].options"></div>';

  var t = $('<div></div>');
  this._handler['visualizations'].forEach(function(visContext, i) {
    var v = $(goog.string.format(visCtxtFmt, i, visContext['decorators']['cls'].join(' '))).appendTo(t);
    visContext['decorators']['elem'].forEach(function(decorator, j) {
      var d = $(goog.string.format(decoratorFmt, decorator['cls'], i, j)).appendTo(v);
    });
  });
  var template = t.html();
  var templateId = u.generatePseudoGUID(10);
  this._$templateCache.put(templateId, template);
  this._template = templateId;
};

goog.inherits(vs.directives.DataContext, vs.directives.Directive);

/**
 * @type {vs.ui.DataHandler}
 * @name vs.directives.DataContext#handler
 */
vs.directives.DataContext.prototype.handler;

/**
 * @type {string}
 * @name vs.directives.DataContext#template
 */
vs.directives.DataContext.prototype.template;

Object.defineProperties(vs.directives.DataContext.prototype, {
  'handler': { get: /** @type {function (this:vs.directives.DataContext)} */ (function() { return this._handler; })},
  'template': { get: /** @type {function (this:vs.directives.DataContext)} */ (function() { return this._template; })}
});


goog.provide('vs.async.Task');

/**
 * @param {function():Promise} func
 * @param {Object} [thisArg]
 * @constructor
 */
vs.async.Task = function(func, thisArg) {
  /**
   * @type {number}
   * @private
   */
  this._id = vs.async.Task.nextId();

  /**
   * @type {function(): Promise}
   * @private
   */
  this._func = func;

  /**
   * @type {Object|undefined}
   * @private
   */
  this._thisArg = thisArg;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._prev = null;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._next = null;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._first = this;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._last = this;
};

/**
 * @type {number}
 * @name vs.async.Task#id
 */
vs.async.Task.prototype.id;

/**
 * @type {Object|undefined}
 * @name vs.async.Task#thisArg
 */
vs.async.Task.prototype.thisArg;

/**
 * @type {function():Promise}
 * @name vs.async.Task#func
 */
vs.async.Task.prototype.func;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#prev
 */
vs.async.Task.prototype.prev;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#next
 */
vs.async.Task.prototype.next;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#first
 */
vs.async.Task.prototype.first;

/**
 * @type {vs.async.Task}
 * @name vs.async.Task#last
 */
vs.async.Task.prototype.last;

Object.defineProperties(vs.async.Task.prototype, {
  'id': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._id; })},
  'thisArg': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._thisArg; })},
  'func': { get: /** @type {function (this:vs.async.Task)} */ (function() { return this._func; })},
  'prev': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._prev; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._prev = value; })
  },
  'next': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._next; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._next = value; })
  },
  'first': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._first; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._first = value; })
  },
  'last': {
    get: /** @type {function (this:vs.async.Task)} */ (function() { return this._last; }),
    set: /** @type {function (this:vs.async.Task)} */ (function(value) { this._last = value; })
  }
});

/**
 * @type {number}
 * @private
 */
vs.async.Task._nextId = 0;

/**
 * @returns {number}
 */
vs.async.Task.nextId = function() {
  return vs.async.Task._nextId++;
};


goog.provide('vs.async.TaskService');

goog.require('vs.async.Task');

/**
 * @param {function(Function, number)} $timeout Angular timeout service
 * @constructor
 */
vs.async.TaskService = function($timeout) {
  /**
   * @type {function(Function, number)}
   * @private
   */
  this._timeout = $timeout || setTimeout;

  /**
   * @type {Object.<number, vs.async.Task>}
   * @private
   */
  this._tasks = {};
};

/**
 * @param {function():Promise} func
 * @param {Object} [thisArg]
 */
vs.async.TaskService.prototype.createTask = function(func, thisArg) {
  var ret = new vs.async.Task(func, thisArg);
  this._tasks[ret['id']] = ret;
  return ret;
};

/**
 * @param {vs.async.Task|function():Promise} t1
 * @param {vs.async.Task|function():Promise} t2
 * @returns {vs.async.Task}
 */
vs.async.TaskService.prototype.chain = function(t1, t2) {
  if (typeof t1 == 'function') {
    return this.chain(new vs.async.Task(t1), t2);
  }

  if (typeof t2 == 'function') {
    return this.chain(t1, new vs.async.Task(t2));
  }

  t1['next'] = t1['next'] || t2['first'];
  t1['last']['next'] = t2['first'];
  t1['last'] = t2['last'];

  t2['prev'] = t2['prev'] || t1['last'];
  t2['first']['prev'] = t1['last'];
  t2['first'] = t1['first'];

  return t1['first'];
};

/**
 * TODO: test!
 * @param {vs.async.Task} task
 * @param {boolean} [sequential] If true, the tasks will run sequentially
 * @returns {Promise}
 */
vs.async.TaskService.prototype.runChain = function(task, sequential) {
  // TODO: test!
  var current = task['first'];
  if (sequential) {
    return new Promise(function(resolve, reject) {
      for (; !!current; current = current['next']) {
        current['func'].apply(current['thisArg']);
      }
      resolve();
    });
  }

  var tasks = [];
  for (; !!current; current = current['next']) {
    tasks.push(current);
  }

  return u.async.each(tasks, function(task) {
    return task['func'].apply(task['thisArg']);
  }, true);
};


goog.provide('vs.models.Margins');

/**
 * @param {number} top
 * @param {number} left
 * @param {number} bottom
 * @param {number} right
 * @constructor
 */
vs.models.Margins = function(top, left, bottom, right) {
  /**
   * @type {number}
   * @private
   */
  this._top = top;

  /**
   * @type {number}
   * @private
   */
  this._left = left;

  /**
   * @type {number}
   * @private
   */
  this._bottom = bottom;

  /**
   * @type {number}
   * @private
   */
  this._right = right;
};

/**
 * @type {number}
 * @name vs.models.Margins#top
 */
vs.models.Margins.prototype.top;

/**
 * @type {number}
 * @name vs.models.Margins#left
 */
vs.models.Margins.prototype.left;

/**
 * @type {number}
 * @name vs.models.Margins#bottom
 */
vs.models.Margins.prototype.bottom;

/**
 * @type {number}
 * @name vs.models.Margins#right
 */
vs.models.Margins.prototype.right;

/**
 * @type {Array.<number>}
 * @name vs.models.Margins#x
 */
vs.models.Margins.prototype.x;

/**
 * @type {Array.<number>}
 * @name vs.models.Margins#y
 */
vs.models.Margins.prototype.y;

Object.defineProperties(vs.models.Margins.prototype, {
  'top': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return this._top; })},
  'left': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return this._left; })},
  'bottom': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return this._bottom; })},
  'right': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return this._right; })},
  'x': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return [this['left'], this['right']]; })},
  'y': { get: /** @type {function (this:vs.models.Margins)} */ (function() { return [this['top'], this['bottom']]; })}
});

/**
 * @param {vs.models.Margins|{top: number, left: number, bottom: number, right: number}} offset
 */
vs.models.Margins.prototype.add = function(offset) {
  return new vs.models.Margins(
    this['top'] + offset['top'],
    this['left'] + offset['left'],
    this['bottom'] + offset['bottom'],
    this['right'] + offset['right']);
};

/**
 * @param {*} other
 * @returns {boolean}
 */
vs.models.Margins.prototype.equals = function(other) {
  return (!!other && this['top'] == other['top'] && this['left'] == other['left'] && this['bottom'] == other['bottom'] && this['right'] == other['right']);
};


goog.provide('vs.ui.Setting');

goog.require('vs.models.DataSource');

// for predefined 'settings':
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

/**
 * @param {{
 *  key: string,
 *  type: (vs.ui.Setting.Type|string),
 *  defaultValue: (function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|*),
 *  label: (string|undefined),
 *  template: (string|undefined),
 *  hidden: (boolean|undefined),
 *  possibleValues: (Array|function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|undefined)
 * }} args
 * @constructor
 */
vs.ui.Setting = function(args) { //key, type, defaultValue, label, template, hidden, possibleValues) {
  /**
   * @type {string}
   */
  this['key'] = args['key'];

  /**
   * @type {vs.ui.Setting.Type|string}
   */
  this['type'] = args['type'];

  /**
   * @type {function(Object.<string, *>, *, vs.models.DataSource, Object.<string, vs.ui.Setting>)|*}
   */
  this['defaultValue'] = args['defaultValue'];

  /**
   * @type {string}
   */
  this['label'] = args['label'] || this['key'];

  /**
   * @type {Array|function(Object.<string, *>, *, (vs.models.DataSource|undefined), (Object.<string, vs.ui.Setting>|undefined))|null}
   * @private
   */
  this._possibleValues = args['possibleValues'] || null;

  /**
   * @type {string}
   */
  this['template'] = args['template'];

  /**
   * @type {boolean}
   */
  this['hidden'] = !!args['hidden'];
};

/**
 * Extracts value from a set of raw options and element attributes
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.getValue = function(options, $attrs, data, settings) {
  // Declaring this as a function, so we don't perform the computation unless necessary
  var self = this;
  var defaultValue = function() {
    return (typeof self['defaultValue'] == 'function') ? self['defaultValue'].call(null, options, $attrs, data, settings) : self['defaultValue'];
  };

  if ((!options || !(this['key'] in options)) && (!$attrs || !(this['key'] in $attrs))) {
    return defaultValue();
  }

  var possibleVals;
  var val = (options && (this['key'] in options)) ? options[this['key']] : $attrs[this['key']];

  switch (this['type']) {
    case vs.ui.Setting.Type['BOOLEAN']:
      if (typeof val == 'boolean') { return val; }
      if (val == 'true') { return true; }
      if (val == 'false') { return false; }
      return defaultValue();

    case vs.ui.Setting.Type['NUMBER']:
      if (typeof val == 'number') { return val; }
      try {
        val = parseFloat(val);
        return (isNaN(val)) ? defaultValue() : val;
      } catch (err) {
        return defaultValue();
      }

    case vs.ui.Setting.Type['STRING']:
      if (typeof val == 'string') { return val; }
      if (typeof val == 'number') { return '' + val; }
      return defaultValue();

    case vs.ui.Setting.Type['DATA_ROW_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['DATA_COL_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['DATA_VAL_LABEL']:
      if (!data) { return val; }

      possibleVals = this.possibleValues(options, $attrs, data, settings);
      if (possibleVals.indexOf(val) < 0) {
        return possibleVals.length > 0 ? possibleVals[0] : defaultValue();
      }
      return val;

    case vs.ui.Setting.Type['ARRAY']:
      if (Array.isArray(val)) { return val; }
      if (typeof val == 'string') {
        try {
          val = JSON.parse(val);
          return (Array.isArray(val)) ? val : defaultValue();
        } catch (err) {
          return defaultValue();
        }
      }
      return defaultValue();

    case vs.ui.Setting.Type['CATEGORICAL']:
      if (this._possibleValues === null) { return val; }
      possibleVals = (typeof this._possibleValues == 'function') ?
        this._possibleValues.call(null, options, $attrs, data, settings) : this._possibleValues;
      return possibleVals.indexOf(val) < 0 ? defaultValue() : val;

    case vs.ui.Setting.Type['OBJECT']:
      if (typeof val == 'object') { return val; }
      if (typeof val == 'string') {
        try {
          return JSON.parse(val);
        } catch (err) {
          return defaultValue();
        }
      }
      return defaultValue();

    case vs.ui.Setting.Type['FUNCTION']:
      if (typeof val == 'function') { return val.call(null, options, $attrs, data, settings); }
      return defaultValue();

    default:
      // In the default case, the type is the fully qualified type name of a class represented as a string
      try {
        var t = u.reflection.evaluateFullyQualifiedTypeName(this['type']);
        if (typeof val == 'object') {
          return u.reflection.wrap(val, t);
        }
        if (typeof val == 'string') {
          var obj = JSON.parse(val);
          return u.reflection.wrap(obj, t);
        }
        return defaultValue();
      } catch (err) {
        return defaultValue();
      }
  }
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.prototype.possibleValues = function(options, $attrs, data, settings) {
  if (this._possibleValues) {
    return (typeof this._possibleValues != 'function') ?
      this._possibleValues : this._possibleValues.call(null, options, $attrs, data, settings);
  }
  if (!data) { return null; }

  switch (this['type']) {
    case vs.ui.Setting.Type['DATA_ROW_LABEL']:
      return data['rows'].map(/** @param {vs.models.DataArray} row */ function(row) { return row['label'] });

    case vs.ui.Setting.Type['DATA_COL_LABEL']:
      return data['cols'].map(/** @param {vs.models.DataArray} col */ function(col) { return col['label'] });

    case vs.ui.Setting.Type['DATA_VAL_LABEL']:
      return data['vals'].map(/** @param {vs.models.DataArray} arr */ function(arr) { return arr['label'] });

    default: return null;
  }
};

/**
 * @enum {string}
 */
vs.ui.Setting.Type = {
  'NUMBER': 'number',
  'STRING': 'string',
  'ARRAY': 'array',
  'BOOLEAN': 'boolean',
  'OBJECT': 'object',
  'CATEGORICAL': 'categorical',
  'DATA_COL_LABEL': 'dataColLbl',
  'DATA_ROW_LABEL': 'dataRowLbl',
  'DATA_VAL_LABEL': 'dataValLbl',
  'FUNCTION': 'function'
};

/**
 * @const {string}
 */
vs.ui.Setting['DEFAULT'] = 'default';

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.valueBoundaries = function (options, $attrs, data, settings) {
  var boundaries;

  if (!settings || !('vals' in settings)) { throw new vs.ui.UiException('Missing dependency for "vals" in the "boundaries" defaultValue function'); }

  var valsArr = data.getVals(/** @type {string} */ (settings['vals'].getValue(options, $attrs, data, settings)));
  boundaries = valsArr['boundaries'] || new vs.models.Boundaries(
      Math.min.apply(null, valsArr['d']),
      Math.max.apply(null, valsArr['d']));

  return boundaries;
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.rowBoundaries = function (options, $attrs, data, settings) {
  var boundaries;

  if (!settings || !('rows' in settings)) { throw new vs.ui.UiException('Missing dependency for "row" in the "boundaries" defaultValue function'); }

  var min, max;
  var rows = settings['rows'].getValue(options, $attrs, data, settings);

  rows.forEach(function(label) {
    var row = data.getRow(label);
    if (!row['boundaries'] && !data['nrows']) {
      return;
    }
    var b = row['boundaries'] || new vs.models.Boundaries(
        Math.min.apply(null, row['d']),
        Math.max.apply(null, row['d']));
    if (min == undefined || b['min'] < min) { min = b['min']; }
    if (max == undefined || b['max'] > max) { max = b['max']; }
  });

  if (min == undefined && max == undefined) { min = max = 0; }
  if (min == undefined) { min = max; }
  if (max == undefined) { max = min; }

  return new vs.models.Boundaries(min, max);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstColsLabel = function (options, $attrs, data, settings) {
  return data['cols'][0]['label']
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstRowsLabel = function (options, $attrs, data, settings) {
  return data['rows'][0]['label']
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.firstValsLabel = function (options, $attrs, data, settings) {
  return data['vals'][0]['label'];
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.xScale = function (options, $attrs, data, settings) {
  var dependencies = ['xBoundaries', 'width', 'margins'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "xScale", which depends on ' + JSON.stringify(dependencies)); }
  dependencies.forEach(function(dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "xScale" defaultValue function');
    }
  });

  var xBoundaries = /** @type {vs.models.Boundaries} */ (settings['xBoundaries'].getValue(options, $attrs, data, settings));
  var width = /** @type {number} */ (settings['width'].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings['margins'].getValue(options, $attrs, data, settings));
  return d3.scale.linear()
    .domain([xBoundaries['min'], xBoundaries['max']])
    .range([0, width - margins['left'] - margins['right']]);
};

/**
 * @param {Object.<string, *>} options
 * @param $attrs Angular attrs
 * @param {vs.models.DataSource} [data]
 * @param {Object.<string, vs.ui.Setting>} [settings]
 * @returns {*}
 */
vs.ui.Setting.yScale = function (options, $attrs, data, settings) {
  var dependencies = ['yBoundaries', 'height', 'margins'];
  if (!settings) { throw new vs.ui.UiException('Settings not provided for "yScale", which depends on ' + JSON.stringify(dependencies)); }
  dependencies.forEach(function(dep) {
    if (!(dep in settings)) {
      throw new vs.ui.UiException('Missing dependency for "' + dep + '" in the "yScale" defaultValue function');
    }
  });

  var yBoundaries = /** @type {vs.models.Boundaries} */ (settings['yBoundaries'].getValue(options, $attrs, data, settings));
  var height = /** @type {number} */ (settings['height'].getValue(options, $attrs, data, settings));
  var margins = /** @type {vs.models.Margins} */ (settings['margins'].getValue(options, $attrs, data, settings));
  return d3.scale.linear()
    .domain([yBoundaries['min'], yBoundaries['max']])
    .range([height - margins['top'] - margins['bottom'], 0]);
};

/**
 * @const {Object.<string, vs.ui.Setting>}
 */
vs.ui.Setting.PredefinedSettings = {
  'col': new vs.ui.Setting({'key':'col', 'type':vs.ui.Setting.Type['DATA_COL_LABEL'], 'defaultValue':vs.ui.Setting.firstColsLabel, 'label':'column', 'template':'_categorical.html'}),
  'row': new vs.ui.Setting({'key':'row', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'row', 'template':'_categorical.html'}),

  'vals': new vs.ui.Setting({'key':'vals', 'type':vs.ui.Setting.Type['DATA_VAL_LABEL'], 'defaultValue':vs.ui.Setting.firstValsLabel, 'label':'values set', 'template':'_categorical.html'}),
  'xBoundaries': new vs.ui.Setting({'key':'xBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.valueBoundaries, 'label':'x boundaries', 'template':'_boundaries.html'}),
  'yBoundaries': new vs.ui.Setting({'key':'yBoundaries', 'type':'vs.models.Boundaries', 'defaultValue':vs.ui.Setting.valueBoundaries, 'label':'y boundaries', 'template':'_boundaries.html'}),

  // TODO: Margins + width and height could well go in a single template that looks pretty. For the future.
  'margins': new vs.ui.Setting({'key':'margins', 'type':'vs.models.Margins', 'defaultValue':new vs.models.Margins(0, 0, 0, 0), 'template':'_margins.html'}),
  'width': new vs.ui.Setting({'key':'width', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300, 'template':'_number.html'}),
  'height': new vs.ui.Setting({'key':'height', 'type':vs.ui.Setting.Type['NUMBER'], 'defaultValue':300, 'template':'_number.html'}),

  'cols': new vs.ui.Setting({'key':'cols', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(options, $attrs, data) { return u.array.range(data['ncols']); }, 'label':'columns', 'template':'_multiselect-tbl.html'}),
  'rows': new vs.ui.Setting({'key':'rows', 'type':vs.ui.Setting.Type['ARRAY'], 'defaultValue':function(options, $attrs, data) { return u.array.range(data['nrows']); }, 'label':'rows', 'template':'_multiselect-tbl.html'}),

  'rowsOrderBy': new vs.ui.Setting({'key':'rowsOrderBy', 'type':vs.ui.Setting.Type['DATA_ROW_LABEL'], 'defaultValue':vs.ui.Setting.firstRowsLabel, 'label':'order rows by', 'template':'_categorical.html'}),
  'rowsScale': new vs.ui.Setting({'key':'rowsScale', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'scale rows axis', 'template':'_switch.html'}),

  'doubleBuffer': new vs.ui.Setting({'key':'doubleBuffer', 'type':vs.ui.Setting.Type['BOOLEAN'], 'defaultValue':true, 'label':'double buffer', 'template':'_switch.html'}),

  'xScale': new vs.ui.Setting({'key':'xScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.xScale, 'hidden': true}),
  'yScale': new vs.ui.Setting({'key':'yScale', 'type':vs.ui.Setting.Type['FUNCTION'], 'defaultValue':vs.ui.Setting.yScale, 'hidden': true})
};


goog.provide('vs.ui.VisHandler');

goog.require('vs.models.DataSource');
goog.require('vs.ui.Setting');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService, threadPool: parallel.ThreadPool}} $ng
 * @param {Object.<string, *>} options
 * @param {vs.models.DataSource} data
 * @constructor
 */
vs.ui.VisHandler = function($ng, options, data) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $ng['$scope'];

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = $ng['$element'];

  /**
   * @type {angular.Attributes}
   * @private
   */
  this._$attrs = $ng['$attrs'];

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $ng['$timeout'];

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = $ng['taskService'];

  /**
   * @type {parallel.ThreadPool}
   * @private
   */
  this._threadPool = $ng['threadPool'];

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = options;

  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = data;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._beginDrawTask = this._taskService.createTask(this.beginDraw, this);

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._endDrawTask = this._taskService.createTask(this.endDraw, this);

  /**
   * @type {Promise}
   * @private
   */
  this._lastDraw = Promise.resolve();

  /**
   * @type {boolean}
   * @private
   */
  this._lastDrawFired = true;

  /**
   * @type {parallel.ThreadProxy}
   * @private
   */
  this._thread = null;

  /**
   * @type {parallel.SharedObject.<vs.models.DataSource>}
   * @private
   */
  this._sharedData = null;

  // Redraw if:

  // Data changed
  /*var self = this;
  var onDataChanged = function() {
    self._threadPool.queue(function(thread) {
      self._thread = thread;
      return thread.swap(self._data.raw(), 'vs.models.DataSource')
        .then(function(d) {
          self._sharedData = d;
        });
    }).then(function() {
      self.draw();
    });
  };
  this._data['changed'].addListener(onDataChanged);

  // Data ready for the first time
  this._data['ready'].then(onDataChanged);*/

  /**
   * @type {boolean}
   * @private
   */
  this._redrawScheduled = false;

  /**
   * @type {Promise}
   * @private
   */
  this._redrawPromise = Promise.resolve();

  this._data['changed'].addListener(this.scheduleRedraw, this);

  // Data ready for the first time
  var self = this;
  this._data['ready'].then(function() { self.scheduleRedraw(); });

  // Options changed
  this._$scope.$watch(
    function(){ return self._options; },
    function() { self.scheduleRedraw(); },
    true);
};

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.VisHandler.Settings = {
  'margins': vs.ui.Setting.PredefinedSettings['margins'],
  'width': vs.ui.Setting.PredefinedSettings['width'],
  'height': vs.ui.Setting.PredefinedSettings['height']
};

/**
 * @type {string}
 * @name vs.ui.VisHandler#render
 */
vs.ui.VisHandler.prototype.render;

/**
 * Gets a list of all settings (option definitions) for this type of visualization
 * @type {Object.<string, vs.ui.Setting>}
 * @name vs.ui.VisHandler#settings
 */
vs.ui.VisHandler.prototype.settings;

/**
 * @type {angular.Scope}
 * @name vs.ui.VisHandler#$scope
 */
vs.ui.VisHandler.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.ui.VisHandler#$element
 */
vs.ui.VisHandler.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name vs.ui.VisHandler#$attrs
 */
vs.ui.VisHandler.prototype.$attrs;

/**
 * The values for the visualization predefined settings
 * @type {Object.<string, *>}
 * @name vs.ui.VisHandler#options
 */
vs.ui.VisHandler.prototype.options;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.VisHandler#data
 */
vs.ui.VisHandler.prototype.data;

/**
 * @type {parallel.SharedObject.<vs.models.DataSource>}
 * @name vs.ui.VisHandler#sharedData
 */
vs.ui.VisHandler.prototype.sharedData;

/**
 * @type {parallel.ThreadProxy}
 * @name vs.ui.VisHandler#thread
 */
vs.ui.VisHandler.prototype.thread;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#beginDrawTask
 */
vs.ui.VisHandler.prototype.beginDrawTask;

/**
 * @type {vs.async.Task}
 * @name vs.ui.VisHandler#endDrawTask
 */
vs.ui.VisHandler.prototype.endDrawTask;

/**
 * @type {vs.models.Margins}
 * @name vs.ui.VisHandler#margins
 */
vs.ui.VisHandler.prototype.margins;

/**
 * @type {number}
 * @name vs.ui.VisHandler#width
 */
vs.ui.VisHandler.prototype.width;

/**
 * @type {number}
 * @name vs.ui.VisHandler#height
 */
vs.ui.VisHandler.prototype.height;

Object.defineProperties(vs.ui.VisHandler.prototype, {
  'render': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { throw new u.UnimplementedException('Property "render" does not exist in data source'); })},
  'settings': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return vs.ui.VisHandler.Settings; })},
  '$scope': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._$attrs; })},
  'options': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._options; })},
  'data': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._data; })},

  'sharedData': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._sharedData; })},
  'thread': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._thread; })},

  'beginDrawTask': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._beginDrawTask; })},
  'endDrawTask': { get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this._endDrawTask; })},

  'margins': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('margins'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['margins'] = value; })
  },

  'width': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('width'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['width'] = value; })
  },

  'height': {
    get: /** @type {function (this:vs.ui.VisHandler)} */ (function() { return this.optionValue('height'); }),
    set: /** @type {function (this:vs.ui.VisHandler)} */ (function(value) { return this._options['height'] = value; })
  }
});

/**
 * @param {string} optionKey
 * @returns {*}
 */
vs.ui.VisHandler.prototype.optionValue = function(optionKey) {
  if (!(optionKey in this['settings'])) { return null; }
  return this['settings'][optionKey].getValue(this['options'], this['$attrs'], this['data'], this['settings']);
};

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.beginDraw = function() { u.log.info('beginDraw'); return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.endDraw = function() { u.log.info('endDraw'); return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.draw = function() {
  var self = this;
  var lastDraw = this._lastDraw;

  u.log.info('trying draw...');
  if (!this._lastDrawFired) { u.log.info('draw already in progress; returning.'); return lastDraw; }

  this._lastDrawFired = false;
  var promise = new Promise(function(resolve, reject) {
    var taskService = self._taskService;

    Promise.resolve()
      .then(function() { return taskService.runChain(self['beginDrawTask']); })
      .then(function() { return taskService.runChain(self['endDrawTask']); })
      .then(function() { self._lastDrawFired = true; return Promise.resolve(); })
      .then(resolve, reject);
  });
  this._lastDraw = promise;
  return promise;
};

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.scheduleRedraw = function() {
  // This will trigger an asynchronous angular digest
  if (!this._redrawScheduled) {
    this._redrawScheduled = true;
    var lastDraw = this._lastDraw || Promise.resolve();
    var self = this;

    this._redrawPromise = new Promise(function(resolve, reject) {
      lastDraw.then(function() { self._$timeout.call(null, function() {
        self._redrawScheduled = false;
        self.draw().then(resolve, reject);
      }, 0); });
    });
  }
  return this._redrawPromise;
};


goog.provide('vs.ui.svg.SvgVis');

goog.require('vs.ui.VisHandler');

/**
 * @constructor
 * @extends vs.ui.VisHandler
 */
vs.ui.svg.SvgVis = function () {
  vs.ui.VisHandler.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgVis, vs.ui.VisHandler);

Object.defineProperties(vs.ui.svg.SvgVis.prototype, {
  'render': { get: /** @type {function (this:vs.ui.svg.SvgVis)} */ (function() { return 'svg'; })}
});

vs.ui.svg.SvgVis.prototype.beginDraw = function () {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args)
      .then(function() {
        if (d3.select(self['$element'][0]).select('svg').empty()) {
          d3.select(self['$element'][0])
            .append('svg')
            .attr('width', '100%')
            .attr('height', '100%')
            .append('rect')
            .style('fill', '#ffffff')
            .attr('width', '100%')
            .attr('height', '100%');
        }
        resolve();
      }, reject);
  });
};


goog.provide('vs.ui.Decorator');

goog.require('vs.async.Task');
goog.require('vs.async.TaskService');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 */
vs.ui.Decorator = function($ng, $targetElement, target, options) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $ng['$scope'];

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = $ng['$element'];

  /**
   * @type {angular.Attributes}
   * @private
   */
  this._$attrs = $ng['$attrs'];

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $ng['$timeout'];

  /**
   * @type {jQuery}
   * @private
   */
  this._$targetElement = $targetElement;

  /**
   * @type {vs.ui.VisHandler}
   * @private
   */
  this._target = target;

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._beginDrawTask = $ng['taskService'].createTask(this.beginDraw, this);

  /**
   * @type {vs.async.Task}
   * @private
   */
  this._endDrawTask = $ng['taskService'].createTask(this.endDraw, this);

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = options;
};

/**
 * @type {angular.Scope}
 * @name vs.ui.Decorator#$scope
 */
vs.ui.Decorator.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.ui.Decorator#$element
 */
vs.ui.Decorator.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name vs.ui.Decorator#$attrs
 */
vs.ui.Decorator.prototype.$attrs;

/**
 * @type {jQuery}
 * @name vs.ui.Decorator#$targetElement
 */
vs.ui.Decorator.prototype.$targetElement;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.Decorator#data
 */
vs.ui.Decorator.prototype.data;

/**
 * @type {vs.ui.VisHandler}
 * @name vs.ui.Decorator#target
 */
vs.ui.Decorator.prototype.target;

/**
 * @type {Object.<string, *>}
 * @name vs.ui.Decorator#options
 */
vs.ui.Decorator.prototype.options;

/**
 * @type {Object.<string, vs.ui.Setting>}
 * @name vs.ui.Decorator#settings
 */
vs.ui.Decorator.prototype.settings;

/**
 * @type {vs.async.Task}
 * @name vs.ui.Decorator#beginDrawTask
 */
vs.ui.Decorator.prototype.beginDrawTask;

/**
 * @type {vs.async.Task}
 * @name vs.ui.Decorator#endDrawTask
 */
vs.ui.Decorator.prototype.endDrawTask;

Object.defineProperties(vs.ui.Decorator.prototype, {
  '$scope': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$attrs; })},
  '$targetElement': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._$targetElement; })},
  'data': { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._target['data']; })},
  'target': { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._target; })},
  'options': { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return this._options; })},
  'settings': { get: /** @type {function (this:vs.ui.Decorator)} */ (function () { return {}; })},
  'beginDrawTask': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._beginDrawTask; })},
  'endDrawTask': { get: /** @type {function (this:vs.ui.Decorator)} */ (function() { return this._endDrawTask; })}
});

/**
 * @param {string} optionKey
 * @returns {*}
 */
vs.ui.Decorator.prototype.optionValue = function(optionKey) {
  if (!(optionKey in this['settings'])) { return null; }
  return this['settings'][optionKey].getValue(this['options'], this['$attrs'], this['data'], this['settings']);
};

/**
 * @returns {Promise}
 */
vs.ui.Decorator.prototype.beginDraw = function() { return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.Decorator.prototype.endDraw = function() { return Promise.resolve(); };


goog.provide('vs.ui.decorators.Axis');

goog.require('vs.ui.Decorator');
goog.require('vs.ui.Setting');


/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Axis = function($ng, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);
};

goog.inherits(vs.ui.decorators.Axis, vs.ui.Decorator);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Axis.Settings = {
  'type': new vs.ui.Setting({'key':'type', 'type': vs.ui.Setting.Type['CATEGORICAL'], 'defaultValue': 'x', 'possibleValues': ['x', 'y']}),
  'ticks': new vs.ui.Setting({'key':'ticks', 'type': vs.ui.Setting.Type['NUMBER'], 'defaultValue': 10}),
  'format': new vs.ui.Setting({'key':'format', 'type': vs.ui.Setting.Type['STRING'], 'defaultValue': 's'})
};

/**
 * @type {{x: string, y: string}}
 */
vs.ui.decorators.Axis.Orientation = {
  'x': 'bottom',
  'y': 'left'
};

/**
 * @type {string}
 * @name vs.ui.decorators.Axis#type
 */
vs.ui.decorators.Axis.prototype.type;

/**
 * @type {number}
 * @name vs.ui.decorators.Axis#ticks
 */
vs.ui.decorators.Axis.prototype.ticks;

/**
 * @type {string}
 * @name vs.ui.decorators.Axis#format
 */
vs.ui.decorators.Axis.prototype.format;

Object.defineProperties(vs.ui.decorators.Axis.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return vs.ui.decorators.Axis.Settings; })},
  'type': { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return this.optionValue('type'); })},
  'ticks': { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function () { return this.optionValue('ticks'); })},
  'format': { get: /** @type {function (this:vs.ui.decorators.Axis)} */ (function() { return this.optionValue('format'); })}
});


goog.provide('vs.models.Point');

/**
 * @param {number} [x]
 * @param {number} [y]
 * @constructor
 */
vs.models.Point = function(x, y) {
  /**
   * @type {number}
   */
  this['x'] = x;

  /**
   * @type {number}
   */
  this['y'] = y;
};


goog.provide('vs.models.Transformer');

goog.require('vs.models.Point');

/**
 * @param {function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point} transformation
 * @constructor
 */
vs.models.Transformer = function(transformation) {
  /**
   * @type {function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point}
   * @private
   */
  this._transformation = transformation;
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} point
 * @returns {vs.models.Point}
 */
vs.models.Transformer.prototype.calc = function(point) {
  return this._transformation.call(null, point);
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} point
 * @returns {Array.<number>}
 */
vs.models.Transformer.prototype.calcArr = function(point) {
  var t = this.calc(point);
  return [t['x'], t['y']];
};

/**
 * @param {number} x
 * @returns {number}
 */
vs.models.Transformer.prototype.calcX = function(x) {
  return this._transformation.call(null, {'x': x})['x'];
};

/**
 * @param {number} y
 * @returns {number}
 */
vs.models.Transformer.prototype.calcY = function(y) {
  return this._transformation({'y': y})['y'];
};

/**
 * @param {vs.models.Transformer|function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point} transformer
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.combine = function(transformer) {
  var self = this;
  if (transformer instanceof vs.models.Transformer) {
    return new vs.models.Transformer(function (point) {
      return transformer.calc(self.calc(point));
    });
  }

  // function
  return new vs.models.Transformer(function (point) {
    return transformer.call(null, self.calc(point));
  });
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} offset
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.translate = function(offset) {
  return this.combine(vs.models.Transformer.translate(offset));
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.scale = function(xScale, yScale) {
  return this.combine(vs.models.Transformer.scale(xScale, yScale));
};

/**
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.intCoords = function() {
  return this.combine(vs.models.Transformer.intCoords());
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} offset
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.translate = function(offset) {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(
      point['x'] != undefined ? point['x'] + offset['x'] : undefined,
      point['y'] != undefined ? point['y'] + offset['y'] : undefined);
  });
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.scale = function(xScale, yScale) {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(
      point['x'] != undefined ? xScale(point['x']) : undefined,
      point['y'] != undefined ? yScale(point['y']) : undefined);
  });
};

/**
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.intCoords = function() {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(Math.floor(point['x']), Math.floor(point['y']));
  });
};


goog.provide('vs.ui.canvas.CanvasAxis');

goog.require('vs.ui.decorators.Axis');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Axis
 */
vs.ui.canvas.CanvasAxis = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Axis.apply(this, arguments);
};

goog.inherits(vs.ui.canvas.CanvasAxis, vs.ui.decorators.Axis);

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasAxis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['target']['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var type = self.type;
    var minYMargin = 25;
    var offset = {'top':0, 'bottom':0, 'left':0, 'right':0};

    if (type == 'x' && target['margins']['bottom'] < minYMargin) { offset['bottom'] = minYMargin - target['margins']['bottom']; }

    if (offset['top'] + offset['bottom'] + offset['left'] + offset['right'] > 0) {
      target['margins'] = target['margins'].add(offset);
      target.scheduleRedraw();
      resolve();
      return;
    }

    var height = target['height'];
    var width = target['width'];
    var margins = target['margins'];
    var intCoords = vs.models.Transformer.intCoords();
    var translate = vs.models.Transformer
      .translate({'x': margins['left'], 'y': margins['top']})
      .intCoords();

    var context = target['pendingCanvas'][0].getContext('2d');
    var moveTo = context.__proto__.moveTo;
    var lineTo = context.__proto__.lineTo;

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Axis decorator'); }

    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    context.font = '17px Times New Roman';
    context.fillStyle = '#000000';

    var ticks = scale.ticks(self['ticks']);
    var units = ticks.map(scale.tickFormat(self['ticks'], self['format']));

    var maxTextSize = Math.max.apply(null, units.map(function(unit) { return context.measureText(unit).width; }));

    var minXMargin = maxTextSize + 11;
    if (type == 'y' && margins['left'] < minXMargin) {
      offset['left'] = minXMargin - margins['left'];
      target['margins'] = margins.add(offset);
      target.scheduleRedraw();
      resolve();
      return;
    }

    var origins = {'x': margins['left'], 'y': height - margins['bottom']};

    // Draw main line
    context.beginPath();
    moveTo.apply(context, intCoords.calcArr(origins));
    switch (type) {
      case 'x': lineTo.apply(context, intCoords.calcArr({'x': width - margins['right'], 'y': origins['y']})); break;
      case 'y': lineTo.apply(context, intCoords.calcArr({'x': origins['x'], 'y': margins['top']})); break;
    }

    // Draw ticks
    var x1 = type == 'x' ? scale : function() { return 0; };
    var x2 = type == 'x' ? scale : function() { return -6; };
    var y1 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom']; };
    var y2 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom'] + 6; };

    ticks.forEach(function(tick) {
      moveTo.apply(context, translate.calcArr({'x': x1(tick), 'y': y1(tick)}));
      lineTo.apply(context, translate.calcArr({'x': x2(tick), 'y': y2(tick)}));
    });

    context.stroke();

    // Draw units
    if (type == 'x') {
      context.textAlign = 'center';
      context.textBaseline = 'top';
    } else {
      context.textAlign = 'right';
      context.textBaseline = 'middle';
      translate = translate.translate({'x': -5, 'y': 0});
    }

    units.forEach(function(unit, i) {
      var p = translate.calc({'x': x2(ticks[i]), 'y': y2(ticks[i])});
      context.fillText(unit, p['x'], p['y']);
    });
    resolve();
  }).then(function() {
    return vs.ui.decorators.Axis.prototype.endDraw.apply(self, args);
  });
};


goog.provide('vs.ui.UiException');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends u.Exception
 */
vs.ui.UiException = function(message, innerException) {
  u.Exception.apply(this, arguments);

  this.name = 'UiException';
};

goog.inherits(vs.ui.UiException, u.Exception);


goog.provide('vs.Configuration');

/**
 * @constructor
 */
vs.Configuration = function() {

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = {};
};

/**
 * @type {Object.<string, *>}
 * @name vs.Configuration#options
 */
vs.Configuration.prototype.options;

Object.defineProperties(vs.Configuration.prototype, {
  'options': { get: /** @type {function (this:vs.Configuration)} */ (function () { return this._options; })}
});

/**
 * @param {Object.<string, *>} options
 */
vs.Configuration.prototype.customize = function(options) {
  u.extend(this._options, options);
};


goog.provide('vs.async.ThreadPoolService');

goog.require('vs.Configuration');
goog.require('vs.ui.UiException');

/**
 * @param {vs.Configuration} config
 * @constructor
 */
vs.async.ThreadPoolService = function(config) {
  var settings = config['options']['parallel'];
  if (!settings) { throw new vs.ui.UiException('Parallel settings have not been configured. Make sure you call configuration.customize({parallel: ...})'); }
  var nthreads = settings['nthreads'] || 16;
  var worker = settings['worker'];
  if (!worker) { throw new vs.ui.UiException('Parallel worker path needs to be defined in the configuration: configuration.customize({parallel: {worker: <path to worker>}})'); }

  /**
   * @type {parallel.ThreadPool}
   * @private
   */
  this._pool = new parallel.ThreadPool(nthreads, worker);
};

/**
 * @type {parallel.ThreadPool}
 * @name vs.async.ThreadPoolService#pool
 */
vs.async.ThreadPoolService.prototype.pool;

Object.defineProperties(vs.async.ThreadPoolService.prototype, {
  'pool': { get: /** @type {function (this:vs.async.ThreadPoolService)} */ (function() { return this._pool; })}
});


goog.provide('vs.ui.VisualizationFactory');

goog.require('vs.Configuration');
goog.require('vs.ui.VisHandler');
goog.require('vs.ui.UiException');
goog.require('vs.models.DataSource');
goog.require('vs.async.TaskService');
goog.require('vs.async.ThreadPoolService');

/**
 * @param {vs.Configuration} config
 * @param {vs.async.TaskService} taskService
 * @param {Function} $timeout
 * @param {vs.async.ThreadPoolService} threadPool
 * @constructor
 */
vs.ui.VisualizationFactory = function(config, taskService, $timeout, threadPool) {

  /**
   * visualization alias -> rendering type -> fully qualified type
   * @type {Object.<string, Object.<string, string>>}
   * @private
   */
  this._visMap = config['options']['visualizations'] || {};

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {Function}
   * @private
   */
  this._$timeout = $timeout;

  /**
   * @type {vs.async.ThreadPoolService}
   * @private
   */
  this._threadPool = threadPool;
};

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @returns {vs.ui.VisHandler}
 */
vs.ui.VisualizationFactory.prototype.createNew = function($scope, $element, $attrs) {
  if (!$attrs['vsContext']) { throw new vs.ui.UiException('No visual context defined for visualization'); }
  var visualContext = $scope.$eval($attrs['vsContext']);
  if (!visualContext) { throw new vs.ui.UiException('Undefined visual context reference: ' + $attrs['vsContext']); }

  var type = visualContext['construct']['type'];
  var render = visualContext['construct']['render'];
  if (!this._visMap[type]) { throw new vs.ui.UiException('Undefined visualization type: ' + type + '. Did you forget to register it in the configuration?'); }
  if (!this._visMap[type][render]) {
    throw new vs.ui.UiException('Unsupported rendering for visualization type ' + type + ': ' + render + '. ' +
      'Supported are the following: ' + Object.keys(this._visMap[type] || {}).join(', ') + '.');
  }

  var typeStr = this._visMap[type][render];
  var visCtor = u.reflection.evaluateFullyQualifiedTypeName(typeStr);

  if (!$attrs['vsData']) { throw new vs.ui.UiException('Data source not defined for visualization: ' + type + '/' + render + '.'); }
  var data = $scope.$eval($attrs['vsData']);
  if (!data) { throw new vs.ui.UiException('Undefined data reference for visualization: ' + type + '/' + render + '.'); }

  return u.reflection.applyConstructor(visCtor, [
    {'$scope':$scope, '$element':$element, '$attrs':$attrs, 'taskService':this._taskService, '$timeout': this._$timeout, 'threadPool': this._threadPool['pool']},
    visualContext['options'], data]);
};


goog.provide('vs.directives.Visualization');

goog.require('vs.directives.Directive');
goog.require('vs.ui.VisualizationFactory');
goog.require('vs.ui.VisHandler');
goog.require('vs.async.TaskService');

/**
 * @param {angular.Scope} $scope
 * @param {vs.ui.VisualizationFactory} visualizationFactory
 * @param {vs.async.TaskService} taskService
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Visualization = function($scope, visualizationFactory, taskService) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.ui.VisHandler}
   * @private
   */
  this._handler = null;

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vs.ui.VisualizationFactory}
   * @private
   */
  this._visualizationFactory = visualizationFactory;
};

goog.inherits(vs.directives.Visualization, vs.directives.Directive);


/**
 * @type {vs.async.TaskService}
 * @name vs.directives.Visualization#taskService
 */
vs.directives.Visualization.prototype.taskService;

/**
 * @type {vs.ui.VisHandler}
 * @name vs.directives.Visualization#handler
 */
vs.directives.Visualization.prototype.handler;

Object.defineProperties(vs.directives.Visualization.prototype, {
  'taskService': { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._taskService; })},
  'handler': { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._handler; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Visualization.prototype.link = {
  'pre': function($scope, $element, $attrs, controller) {
    this._handler = this._visualizationFactory.createNew($scope, $element, $attrs);
    $element.css({
      'top': (this._handler['options']['y'] || 0) + 'px',
      'left': (this._handler['options']['x'] || 0) + 'px',
      'width': this._handler['options']['width'] + 'px',
      'height': this._handler['options']['height'] + 'px'
    });
  },

  'post': function($scope, $element, $attrs, controller) {
    var self = this;
    $element.on('resizeend', function(e) {
      self._handler['options']['width'] = e['width'];
      self._handler['options']['height'] = e['height'];
      self._handler.scheduleRedraw();
    });
  }
};


goog.provide('vs.directives.GraphicDecorator');

goog.require('vs.directives.Visualization');
goog.require('vs.ui.Decorator');
goog.require('vs.ui.VisHandler');

goog.require('vs.async.TaskService');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @param {boolean} [overridesVisHandler] If set to true, this flag will allow the decorator's draw methods to execute
 * before and after respectively of the VisHandler's beginDraw/endDraw methods.
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.GraphicDecorator = function($scope, taskService, $timeout, overridesVisHandler) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $timeout;

  /**
   * @type {vs.ui.Decorator}
   * @private
   */
  this._handler = null;

  /**
   * @type {boolean}
   * @private
   */
  this._overridesVisHandler = !!overridesVisHandler;
};

goog.inherits(vs.directives.GraphicDecorator, vs.directives.Directive);

/**
 * @type {vs.ui.Decorator}
 * @name vs.directives.GraphicDecorator#handler
 */
vs.directives.GraphicDecorator.prototype.handler;

Object.defineProperties(vs.directives.GraphicDecorator.prototype, {
  'handler': { get: /** @type {function (this:vs.directives.GraphicDecorator)} */ (function() { return this._handler; })}
});

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);

  /** @type {vs.directives.Visualization} */
  var vis = $scope['visualization']['handler'];
  var options = $attrs['vsOptions'] ? $scope.$eval($attrs['vsOptions']) : {};

  this._handler = this.createDecorator(
    {'$scope':$scope, '$element':$element, '$attrs':$attrs, 'taskService':this._taskService, '$timeout':this._$timeout},
    $element.parent(),
    vis['handler'],
    /** @type {Object.<string, *>} */ (options));

  if (!this._overridesVisHandler) {
    this._taskService.chain(this._handler['endDrawTask'], vis['handler']['endDrawTask']);
    this._taskService.chain(vis['handler']['beginDrawTask'], this._handler['beginDrawTask']);
  } else {
    this._taskService.chain(vis['handler']['endDrawTask'], this._handler['endDrawTask']);
    this._taskService.chain(this._handler['beginDrawTask'], vis['handler']['beginDrawTask']);
  }
};

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 */
vs.directives.GraphicDecorator.prototype.createDecorator = function($ng, $targetElement, target, options) { throw new u.AbstractMethodException(); };


goog.provide('vs.ui.svg.SvgAxis');

goog.require('vs.ui.decorators.Axis');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Axis
 */
vs.ui.svg.SvgAxis = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Axis.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgAxis, vs.ui.decorators.Axis);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgAxis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['target']['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var svg = d3.select(target['$element'][0]).select('svg');
    var type = self.type;
    var className = 'vs-axis-' + type;
    var axis = svg.select('.' + className);
    if (axis.empty()) {
      axis = svg.insert('g', '.viewport')
        .attr('class', className);
    }

    var height = target['height'];
    var width = target['width'];
    var margins = target['margins'];
    var origins = {'x': margins['left'], 'y': height - margins['bottom']};

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Axis decorator'); }

    var axisFn = d3.svg.axis()
      .scale(scale)
      .orient(vs.ui.decorators.Axis.Orientation[type])
      .ticks(self['ticks']);

    if (self['format']) {
      axisFn = axisFn.tickFormat(d3.format(self['format']));
    }

    axis.call(axisFn);

    var axisBox = axis[0][0]['getBBox'](); // Closure compiler doesn't recognize the getBBox function
    var axisLocation = type == 'x' ? origins : {'x': margins['left'], 'y': margins['top']};
    axisBox = { 'x': axisBox['x'] + axisLocation['x'], 'y': axisBox['y'] + axisLocation['y'], 'width': axisBox['width'], 'height': axisBox['height']};

    var offset = {'top':0, 'bottom':0, 'left':0, 'right':0};

    var dif;
    if (axisBox['height'] > height) {
      dif = (axisBox['height'] - height);
      offset['top'] += 0.5 * dif;
      offset['bottom'] += 0.5 * dif;
    }

    if (axisBox['width'] > width) {
      dif = (axisBox['width'] - width);
      offset['left'] += 0.5 * dif;
      offset['right'] += 0.5 * dif;
    }

    if (axisBox['x'] < 0) { offset['left'] += -axisBox['x']; }
    if (axisBox['y'] < 0) { offset['top'] += -axisBox['y']; }
    if (axisBox['x'] + axisBox['width'] > width) { offset['right'] += axisBox['x'] + axisBox['width'] - width; }
    if (axisBox['y'] + axisBox['height'] > height) { offset['bottom'] += axisBox['y'] + axisBox['height'] - height; }

    if (offset['top'] + offset['left'] + offset['bottom'] + offset['right'] > 0) {
      target['margins'] = target['margins'].add(offset);
      target.scheduleRedraw();
    }

    axis.attr('transform', 'translate(' + axisLocation['x'] + ', ' + axisLocation['y'] + ')');
    resolve();
  }).then(function() {
    return vs.ui.decorators.Axis.prototype.endDraw.apply(self, args);
  });
};


goog.provide('vs.directives.Axis');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.VisHandler');
goog.require('vs.ui.svg.SvgAxis');
goog.require('vs.ui.canvas.CanvasAxis');

goog.require('vs.async.TaskService');

/**
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Axis = function() {
  vs.directives.GraphicDecorator.apply(this, arguments);
};

goog.inherits(vs.directives.Axis, vs.directives.GraphicDecorator);

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Axis.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgAxis($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasAxis($ng, $targetElement, target, options);
  }
  return null;
};


goog.provide('vs.directives.Resizable');

goog.require('vs.directives.Directive');

/**
 * @param {angular.Scope} $scope
 * @param $document
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Resizable = function($scope, $document) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular document
   * @private
   */
  this._document = $document;

  /**
   * @type {number}
   * @private
   */
  this._minWidth = 65;

  /**
   * @type {number}
   * @private
   */
  this._minHeight = 65;
};

goog.inherits(vs.directives.Resizable, vs.directives.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.Resizable.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);
  var $window = $scope['vsWindow']['handler']['$window'];
  $window
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-top-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-top-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-bottom-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-diagonal vs-grab-bottom-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-vertical vs-grab-left"></div>')
    .append('<div class="vs-resize-grab vs-grab-vertical vs-grab-right"></div>')
    .append('<div class="vs-resize-grab vs-grab-horizontal vs-grab-bottom"></div>');

  var box;
  var startX, startY, target;

  var self = this;
  function mousedown(event) {
    // Prevent default dragging of selected content
    event.stopPropagation();
    event.preventDefault();
    box = new vs.directives.Resizable.BoundingBox($window);
    target = box.getHandler($(this));
    startX = event.pageX - target.left;
    startY = event.pageY - target.top;
    self._document.on('mousemove', mousemove);
    self._document.on('mouseup', mouseup);

    $window.trigger($.Event('resizestart', {}));
    $element.trigger($.Event('resizestart', {}));
  }

  function mousemove(event) {

    event.stopPropagation();
    event.preventDefault();

    var newY = event.pageY - startY;
    var newX = event.pageX - startX;

    target.top = newY;
    target.left = newX;

    box.update(target, self._minWidth, self._minHeight);
    
    $window.css({
      'top': (box.top) + 'px',
      'left': (box.left) + 'px',
      'width': box.width + 'px',
      'height': box.height + 'px'
    });

    $element.css({
      'top': (box.top) + 'px',
      'left': (box.left) + 'px',
      'width': box.width + 'px',
      'height': box.height + 'px'
    });

    $window.trigger($.Event('resize', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
    $element.trigger($.Event('resize', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
  }

  function mouseup(event) {
    event.preventDefault();
    event.stopPropagation();
    self._document.off('mousemove', mousemove);
    self._document.off('mouseup', mouseup);
    $window.trigger($.Event('resizeend', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
    $element.trigger($.Event('resizeend', {'top': box.top, 'left': box.left, 'width': box.width, 'height': box.height}));
  }

  $window.find('> .vs-resize-grab').on('mousedown', mousedown);
};

/**
 * @param {jQuery} $elem
 * @constructor
 */
vs.directives.Resizable.ResizeHandler = function($elem) {
  /** @type {jQuery} */
  this.$elem = $elem;
  var rect = $elem[0].getBoundingClientRect();

  // We compute the relative position of this handler to the window's parent element
  // We add 1 to each because jQuery.position() includes all margins and borders; so if we change the border of window,
  // this should also change
  var pos = {left:$elem.position().left + $elem.parent().position().left + 1, top:$elem.position().top + $elem.parent().position().top + 1};
  this.top = pos.top;
  this.left = pos.left;
  this.width = rect.width;
  this.height = rect.height;
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.topLeft = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-top-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.topRight = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-top-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottomLeft = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottomRight = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.left = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-left'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.right = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-right'));
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.ResizeHandler.bottom = function($elem) {
  return new vs.directives.Resizable.ResizeHandler($elem.find('> .vs-grab-bottom'));
};

/**
 * @param {jQuery} $element
 * @constructor
 */
vs.directives.Resizable.BoundingBox = function($element) {
  this.offset = $element.position();
  this.topLeft = vs.directives.Resizable.ResizeHandler.topLeft($element);
  this.topRight = vs.directives.Resizable.ResizeHandler.topRight($element);
  this.bottomLeft = vs.directives.Resizable.ResizeHandler.bottomLeft($element);
  this.bottomRight = vs.directives.Resizable.ResizeHandler.bottomRight($element);
  this.leftHandler = vs.directives.Resizable.ResizeHandler.left($element);
  this.rightHandler = vs.directives.Resizable.ResizeHandler.right($element);
  this.bottomHandler = vs.directives.Resizable.ResizeHandler.bottom($element);

  // This assumes that all handlers are square and of the same size
  // The 1 corresponds to the border
  this._margin = -this.topLeft.width * 0.5 - 1;
};

/**
 * @param {jQuery} $elem
 * @returns {vs.directives.Resizable.ResizeHandler}
 */
vs.directives.Resizable.BoundingBox.prototype.getHandler = function($elem) {
  switch ($elem[0]) {
    case this.topLeft.$elem[0]:
      return this.topLeft;
    case this.bottomLeft.$elem[0]:
      return this.bottomLeft;
    case this.topRight.$elem[0]:
      return this.topRight;
    case this.bottomRight.$elem[0]:
      return this.bottomRight;
    case this.leftHandler.$elem[0]:
      return this.leftHandler;
    case this.rightHandler.$elem[0]:
      return this.rightHandler;
    case this.bottomHandler.$elem[0]:
      return this.bottomHandler;
    default:
      return null;
  }
};

/**
 * @param {vs.directives.Resizable.ResizeHandler} handler
 * @param {number} [minWidth]
 * @param {number} [minHeight]
 */
vs.directives.Resizable.BoundingBox.prototype.update = function(handler, minWidth, minHeight) {
  minWidth = minWidth || 0;
  minHeight = minHeight || 0;
  switch (handler) {
    case this.topLeft:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin - minHeight);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin - minWidth);
      this.bottomLeft.left = handler.left;
      this.topRight.top = handler.top;
      this.leftHandler.left = handler.left;
      break;
    case this.bottomLeft:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);
      handler.left = Math.min(handler.left, this.topRight.left - handler.width - 2 * this._margin - minWidth);
      this.topLeft.left = handler.left;
      this.bottomRight.top = handler.top;
      this.leftHandler.left = handler.left;
      this.bottomHandler.top = handler.top;
      break;
    case this.topRight:
      handler.top = Math.min(handler.top, this.bottomLeft.top - handler.height - 2 * this._margin - minHeight);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin + minWidth);
      this.topLeft.top = handler.top;
      this.bottomRight.left = handler.left;
      this.rightHandler.left = handler.left;
      break;
    case this.bottomRight:
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);
      handler.left = Math.max(handler.left, this.topLeft.left + this.topLeft.width + 2 * this._margin + minWidth);
      this.topRight.left = handler.left;
      this.bottomLeft.top = handler.top;
      this.rightHandler.left = handler.left;
      this.bottomHandler.top = handler.top;
      break;
    case this.leftHandler:
      handler.top = this.topLeft.top;
      handler.left = Math.min(handler.left, this.rightHandler.left - handler.width - 2 * this._margin - minWidth);

      this.topLeft.left = handler.left;
      this.bottomLeft.left = handler.left;

      break;
    case this.rightHandler:
      handler.top = this.topLeft.top;
      handler.left = Math.max(handler.left, this.leftHandler.left + this.leftHandler.width + 2 * this._margin + minWidth);

      this.topRight.left = handler.left;
      this.bottomRight.left = handler.left;

      break;
    case this.bottomHandler:
      handler.left = this.topLeft.left;
      handler.top = Math.max(handler.top, this.topLeft.top + this.topLeft.height + 2 * this._margin + minHeight);

      this.bottomRight.top = handler.top;
      this.bottomLeft.top = handler.top;
      break;
  }
};

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#left
 */
vs.directives.Resizable.BoundingBox.prototype.left;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#top
 */
vs.directives.Resizable.BoundingBox.prototype.top;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#width
 */
vs.directives.Resizable.BoundingBox.prototype.width;

/**
 * @type {number}
 * @name vs.directives.Resizable.BoundingBox#height
 */
vs.directives.Resizable.BoundingBox.prototype.height;

Object.defineProperties(vs.directives.Resizable.BoundingBox.prototype, {
  left: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() { return this.topLeft.left + this.topLeft.width + this._margin; })
  },
  top: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() { return this.topLeft.top + this.topLeft.height + this._margin; })
  },
  width: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() {
      return this.topRight.left - this.topLeft.left - this.topLeft.width - 2 * this._margin - 2;
    })
  },
  height: {
    get: /** @type {function (this:vs.directives.Resizable.BoundingBox)} */ (function() {
      return this.bottomLeft.top - this.topLeft.top - this.topLeft.height - this._margin - 1;
    })
  }
});


goog.provide('vs.ui.decorators.Grid');

goog.require('vs.ui.Decorator');
goog.require('vs.ui.Setting');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Grid = function($ng, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);
};

goog.inherits(vs.ui.decorators.Grid, vs.ui.Decorator);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Grid.Settings = {
  'type': new vs.ui.Setting({'key':'type', 'type': vs.ui.Setting.Type['CATEGORICAL'], 'defaultValue': 'x', 'possibleValues': ['x', 'y']}),
  'ticks': new vs.ui.Setting({'key':'ticks', 'type': vs.ui.Setting.Type['NUMBER'], 'defaultValue': 10}),
  'format': new vs.ui.Setting({'key':'format', 'type': vs.ui.Setting.Type['STRING'], 'defaultValue': 's'})
};

/**
 * @type {string}
 * @name vs.ui.decorators.Grid#type
 */
vs.ui.decorators.Grid.prototype.type;

/**
 * @type {number}
 * @name vs.ui.decorators.Grid#ticks
 */
vs.ui.decorators.Grid.prototype.ticks;

/**
 * @type {string}
 * @name vs.ui.decorators.Grid#format
 */
vs.ui.decorators.Grid.prototype.format;

Object.defineProperties(vs.ui.decorators.Grid.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return vs.ui.decorators.Grid.Settings; })},
  'type': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return this.optionValue('type'); })},
  'ticks': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function () { return this.optionValue('ticks'); })},
  'format': { get: /** @type {function (this:vs.ui.decorators.Grid)} */ (function() { return this.optionValue('format'); })}
});


goog.provide('vs.ui.svg.SvgGrid');

goog.require('vs.ui.decorators.Grid');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Grid
 */
vs.ui.svg.SvgGrid = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Grid.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgGrid, vs.ui.decorators.Grid);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgGrid.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['target']['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var svg = d3.select(target['$element'][0]).select('svg');

    var type = self.type;
    var className = 'grid-' + type;
    var grid = svg.select('.' + className);
    if (grid.empty()) {
      grid = svg.insert('g', '.viewport')
        .attr('class', className);
    }

    var height = target['height'];
    var width = target['width'];
    var margins = target['margins'];
    var origins = {'x': margins['left'], 'y': height - margins['bottom']};

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Grid decorator'); }

    var gridLines = grid
      .selectAll('.grid-line')
      .data(scale.ticks(self['ticks']));

    gridLines
      .enter().append('line')
      .attr('class', 'grid-line');

    var x1 = type == 'x' ? scale : 0;
    var x2 = type == 'x' ? scale : width - margins['left'] - margins['right'];
    var y1 = type == 'y' ? scale : 0;
    var y2 = type == 'y' ? scale : height - margins['top'] - margins['bottom'];

    gridLines
      .attr('transform', 'translate(' + margins['left'] + ', ' + margins['top'] + ')')
      .attr('x1', x1)
      .attr('x2', x2)
      .attr('y1', y1)
      .attr('y2', y2)
      .style('stroke', '#eeeeee')
      .style('shape-rendering', 'crispEdges');

    gridLines.exit().remove();
    resolve();
  }).then(function() {
    return vs.ui.decorators.Grid.prototype.endDraw.apply(self, args);
  });
};


goog.provide('vs.ui.canvas.CanvasGrid');

goog.require('vs.ui.decorators.Grid');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Grid
 */
vs.ui.canvas.CanvasGrid = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Grid.apply(this, arguments);
};

goog.inherits(vs.ui.canvas.CanvasGrid, vs.ui.decorators.Grid);

vs.ui.canvas.CanvasGrid.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['target']['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var type = self.type;
    var margins = target['margins'];
    var height = target['height'];
    var width = target['width'];
    var intCoords = vs.models.Transformer.intCoords();
    var translate = vs.models.Transformer
      .translate({'x': margins['left'], 'y': margins['top']})
      .intCoords();

    var context = target['pendingCanvas'][0].getContext('2d');
    var moveTo = context.__proto__.moveTo;
    var lineTo = context.__proto__.lineTo;

    var scale = (type == 'x') ? target.optionValue('xScale') : target.optionValue('yScale');
    if (!scale) { throw new vs.ui.UiException('Visualization must have "xScale"/"yScale" settings defined in order to use the Grid decorator'); }

    context.strokeStyle = '#eeeeee';
    context.lineWidth = 1;

    var ticks = scale.ticks(self['ticks']);

    // Draw ticks
    var x1 = type == 'x' ? scale : function() { return 0; };
    var x2 = type == 'x' ? scale : function() { return width - margins['left'] - margins['right']; };
    var y1 = type == 'y' ? scale : function() { return 0; };
    var y2 = type == 'y' ? scale : function() { return height - margins['top'] - margins['bottom']; };

    ticks.forEach(function(tick) {
      moveTo.apply(context, translate.calcArr({'x': x1(tick), 'y': y1(tick)}));
      lineTo.apply(context, translate.calcArr({'x': x2(tick), 'y': y2(tick)}));
    });


    context.stroke();
    resolve();
  }).then(function() {
    return vs.ui.decorators.Grid.prototype.endDraw.apply(self, args);
  });
};


goog.provide('vs.directives.Grid');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.svg.SvgGrid');
goog.require('vs.ui.canvas.CanvasGrid');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Grid = function($scope, taskService, $timeout) {
  vs.directives.GraphicDecorator.apply(this, arguments);
};

goog.inherits(vs.directives.Grid, vs.directives.GraphicDecorator);

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Grid.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgGrid($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasGrid($ng, $targetElement, target, options);
  }
  return null;
};


goog.provide('vs.directives.Window');

goog.require('vs.directives.Directive');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Window = function() {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {jQuery}
   * @private
   */
  this._$window = null;
};

goog.inherits(vs.directives.Window, vs.directives.Directive);

/**
 * @type {jQuery}
 * @name vs.directives.Window#$window
 */
vs.directives.Window.prototype.$window;

Object.defineProperties(vs.directives.Window.prototype, {
  '$window': { get: /** @type {function (this:vs.directives.Window)} */ (function() { return this._$window; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Window.prototype.link = {
  'pre': function($scope, $element, $attrs, controller) {
    vs.directives.Directive.prototype.link['pre'].apply(this, arguments);
    var $window = $('<div class="vs-window-container"></div>').appendTo($element.parent());
    var style = $scope.$eval($attrs['vsStyle'] || '{}');

    var box = {
      'top': style['top'] || ($element.css('top') ? (parseInt($element.css('top'), 10) + parseInt($window.css('padding-top'), 10)) + 'px' : undefined),
      'left': style['left'] || $element.css('left') || undefined,
      'bottom': style['bottom'] || $element.css('bottom') || undefined,
      'right': style['right'] || $element.css('right') || undefined,
      'width': style['width'] || ($element.width() + 'px'),
      'height': style['height'] || ($element.height() + 'px')
    };

    /*$window.css({
      'top': (parseInt($element.css('top'), 10) + parseInt($window.css('padding-top'), 10)) + 'px',
      'left': $element.css('left'),
      'bottom': $element.css('bottom'),
      'right': $element.css('right')
    });*/
    $window.css(box);

    $element.css({
      'top': '',
      'left': '',
      'bottom': '',
      'right': ''
    });

    $window.append($element);

    // Bring to front when selected
    $window.on('mousedown', function() {
      $window.siblings().css('zIndex', 0);
      $window.css('zIndex', 1);
    });

    this._$window = $window;
  },
  'post': vs.directives.Directive.prototype.link['post']
};


goog.provide('vs.directives.Movable');

goog.require('vs.directives.Directive');

/**
 * @param {angular.Scope} $scope
 * @param $document
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Movable = function($scope, $document) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular document
   * @private
   */
  this._document = $document;
};

goog.inherits(vs.directives.Movable, vs.directives.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.Movable.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);
  var $window = $scope['vsWindow']['handler']['$window'];
  $window.css({ 'cursor': 'move' });

  var startX = 0, startY = 0, x, y;

  var $document = this._document;
  function mousedown(event) {
    if (event.target != $window[0]) { return; }

    // Prevent default dragging of selected content
    event.preventDefault();
    var childOffset = $window.position();
    x = childOffset.left;
    y = childOffset.top;
    startX = event.pageX - x;
    startY = event.pageY - y;
    $document.on('mousemove', mousemove);
    $document.on('mouseup', mouseup);
  }

  function mousemove(event) {
    y = event.pageY - startY;
    x = event.pageX - startX;
    $window.css({
      'top': y + 'px',
      'left':  x + 'px'
    });
  }

  function mouseup() {
    $document.off('mousemove', mousemove);
    $document.off('mouseup', mouseup);
  }

  $window.on('mousedown', mousedown);
};


goog.provide('vs.directives.LoadingDecorator');

goog.require('vs.directives.Directive');
goog.require('vs.async.TaskService');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.LoadingDecorator = function($scope, taskService, $timeout) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {angular.$timeout}
   * @private
   */
  this._$timeout = $timeout;
};

goog.inherits(vs.directives.LoadingDecorator, vs.directives.Directive);

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.LoadingDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);

  /** @type {vs.directives.Visualization} */
  var vis = $scope['visualization']['handler'];

  /** @type {vs.ui.VisHandler} */
  var target = vis['handler'];

  var startTimeout = null;
  var endTimeout = null;
  var progressInterval = null;

  var $overlay = $('<div class="vs-loading-overlay" style="opacity: 0;"></div>').appendTo($element);

  var $container = $('<div class="vs-loading-container" style="opacity: 0;"></div>').appendTo($element);

  var $progress = $('<div class="progress" ></div>').appendTo($container);
  var $progressBar = $(
    '<div class="progress-bar progress-bar-success progress-bar-striped active" role="progressbar" aria-valuenow="0" ' +
          'aria-valuemin="0" aria-valuemax="100" style="width:0"> ' +
    '</div>').appendTo($progress);

  var updateProgress = function() {
    $progressBar.css({
     '-webkit-transition': '',
     '-o-transition': '',
     'transition': ''
     });
    var w = $progressBar.css('width');
    var p = (w == undefined || w.indexOf('px') >= 0) ? ($progressBar.width() / $progress.width() * 100) : parseInt(w, 10);
    if (p >= 99) { return; }
    var remaining = 100 - p;
    p = Math.min(p + Math.ceil(remaining * 0.25), 99);
    $progressBar.css('width', p + '%');
  };

  $element.on('resizestart', function(e) {
    $overlay.css('opacity', '1');
  });
  $element.on('resizeend', function(e) {
    target.scheduleRedraw()
      .then(function() {
        $overlay.css('opacity', '0');
      });
  });

  var afterDraw = function() {
    if (endTimeout != null) { return Promise.resolve(); }
    if (startTimeout != null) {
      clearTimeout(startTimeout);
      startTimeout = null;
      return Promise.resolve();
    }

    endTimeout = setTimeout(function() {
      endTimeout = null;
      clearInterval(progressInterval);
      $container.css('opacity', 0);
      $progressBar.css('width', '100%');
    }, 500);
    return Promise.resolve();
  };

  var beforeDraw = function() {
    if (startTimeout != null) { return Promise.resolve(); }
    if (endTimeout != null) {
      clearTimeout(endTimeout);
      endTimeout = null;
      return Promise.resolve();
    }
    startTimeout = setTimeout(function() {
      startTimeout = null;
      $progressBar.css({
        '-webkit-transition': 'none',
        '-o-transition': 'none',
        'transition': 'none'
      });
      $progressBar.css('width', '0');
      $container.css('opacity', '1');

      progressInterval = setInterval(updateProgress, 500)
    }, 500);

    // In this case, it's ok to resolve the promise before the timeout is done; we don't want the visualization to wait
    return Promise.resolve();
  };

  target['data']['changing'].addListener(beforeDraw);
  target['data']['changed'].addListener(afterDraw);

  this._taskService.chain(target['endDrawTask'], this._taskService.createTask(afterDraw));
  this._taskService.chain(this._taskService.createTask(beforeDraw), target['beginDrawTask']);
};


goog.provide('vs.models.ModelsException');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends u.Exception
 */
vs.models.ModelsException = function(message, innerException) {
  u.Exception.apply(this, arguments);

  this.name = 'ModelsException';
};

goog.inherits(vs.models.ModelsException, u.Exception);


goog.provide('vs.models.GenomicRangeQuery');

goog.require('vs.models.Query');
goog.require('vs.models.ModelsException');

/**
 * @param {string} chr
 * @param {number} start
 * @param {number} end
 * @constructor
 */
vs.models.GenomicRangeQuery = function(chr, start, end) {

  start = parseInt(start, 10);
  end = parseInt(end, 10);

  /**
   * @type {Array.<vs.models.Query>}
   * @private
   */
  this._query = [
    new vs.models.Query({
      'target': vs.models.Query.Target['ROWS'],
      'targetLabel': 'chr',
      'test': vs.models.Query.Test['EQUALS'],
      'testArgs': chr
    }),
    new vs.models.Query({
      'target': vs.models.Query.Target['ROWS'],
      'targetLabel': 'start',
      'test': vs.models.Query.Test['LESS_THAN'],
      'testArgs': end
    }),
    new vs.models.Query({
      'target': vs.models.Query.Target['ROWS'],
      'targetLabel': 'end',
      'test': vs.models.Query.Test['GREATER_OR_EQUALS'],
      'testArgs': start
    })
  ];

  /**
   * @type {string}
   * @private
   */
  this._chr = chr;

  /**
   * @type {number}
   * @private
   */
  this._start = start;

  /**
   * @type {number}
   * @private
   */
  this._end = end;
};

/**
 * @type {string}
 * @name vs.models.GenomicRangeQuery#chr
 */
vs.models.GenomicRangeQuery.prototype.chr;

/**
 * @type {number}
 * @name vs.models.GenomicRangeQuery#start
 */
vs.models.GenomicRangeQuery.prototype.start;

/**
 * @type {number}
 * @name vs.models.GenomicRangeQuery#end
 */
vs.models.GenomicRangeQuery.prototype.end;

/**
 * @type {Array.<vs.models.Query>}
 * @name vs.models.GenomicRangeQuery#query
 */
vs.models.GenomicRangeQuery.prototype.query;

Object.defineProperties(vs.models.GenomicRangeQuery.prototype, {
  'chr': { get: /** @type {function (this:vs.models.GenomicRangeQuery)} */ (function() { return this._chr; })},
  'start': { get: /** @type {function (this:vs.models.GenomicRangeQuery)} */ (function() { return this._start; })},
  'end': { get: /** @type {function (this:vs.models.GenomicRangeQuery)} */ (function() { return this._end; })},
  'query': { get: /** @type {function (this:vs.models.GenomicRangeQuery)} */ (function() { return this._query; })}
});

/**
 * @param {Array.<vs.models.Query>} query
 * @returns {vs.models.GenomicRangeQuery}
 */
vs.models.GenomicRangeQuery.extract = function(query) {
  var rowLabels = ['chr', 'start', 'end'];
  var chrValidTests = ['==']; // TODO: Later, add support for all others. Shouldn't be that hard, if we use the ChrTree
  var bpValidTests = ['<', '>='];

  var rowQueries = query.filter(function(q) {
    if (q['target'] != vs.models.Query.Target['ROWS']) { return false; }
    if (rowLabels.indexOf(q['targetLabel']) < 0) { return false; }
    if ((q['targetLabel'] == 'chr' && chrValidTests.indexOf(q['test']) < 0) || q['negate']) {
      throw new vs.models.ModelsException('The ' + q['test'] + ' operation is not yet supported for chromosomes; supported operations are: ' + JSON.stringify(chrValidTests));
    }
    if ((q['targetLabel'] == 'start' || q['targetLabel'] == 'end') && bpValidTests.indexOf(q['test']) < 0) {
      throw new vs.models.ModelsException('The ' + q['test'] + ' operation is not yet supported for start/end positions by the bigwig library; supported operations are: ' + JSON.stringify(bpValidTests));
    }
    if (q['targetLabel'] == 'start' && (q['test'] == '>=' || (q['test'] == '<' && q['negate']))) {
      throw new vs.models.ModelsException('The only supported test for "start" is "<"');
    }
    if (q['targetLabel'] == 'end' && (q['test'] == '<' || (q['test'] == '>=' && q['negate']))) {
      throw new vs.models.ModelsException('The only supported test for "end" is ">="');
    }
    return true;
  });

  var chrQueries = rowQueries.filter(function(q) { return q['targetLabel'] == 'chr' && !q['negate']; });
  var startEndQueries = rowQueries.filter(function(q) { return q['targetLabel'] == 'start' || q['targetLabel'] == 'end' });
  var greaterThanQueries = startEndQueries.filter(function(q) { return q['test'] == '>=' || (q['negate'] && q['test'] == '<'); });
  var lessThanQueries = startEndQueries.filter(function(q) { return q['test'] == '<' || (q['negate'] && q['test'] == '>='); });

  if (rowQueries.length > 0 && chrQueries.length != 1) {
    throw new vs.models.ModelsException('Valid queries must either be empty, or contain exactly one "chr == " test');
  }
  if (rowQueries.length > 0 && startEndQueries.length < 2) {
    throw new vs.models.ModelsException('Valid queries must either be empty, or contain at least two "start/end < or >= " tests');
  }
  if (rowQueries.length > 0 && (lessThanQueries.length < 1 || greaterThanQueries.length < 1)) {
    throw new vs.models.ModelsException('Valid queries must either be empty, or contain a finite start/end range');
  }

  var range = rowQueries.length == 0 ? undefined : {
    chr: chrQueries[0]['testArgs'],
    end: startEndQueries.filter(function(q) { return q['targetLabel'] == 'start'; }).map(function(q) { return q['testArgs']; }).reduce(function(v1, v2) { return Math.min(v1, v2); }),
    start: startEndQueries.filter(function(q) { return q['targetLabel'] == 'end'; }).map(function(q) { return q['testArgs']; }).reduce(function(v1, v2) { return Math.max(v1, v2); })
  };

  return new vs.models.GenomicRangeQuery(range.chr, range.start, range.end);
};


goog.provide('vs.ui.BrushingEvent');

goog.require('vs.ui.VisHandler');
goog.require('vs.models.DataSource');

/**
 * @param {vs.ui.VisHandler} source
 * @param {vs.models.DataSource} data
 * @param {vs.models.DataRow} selectedRow
 * @param {vs.ui.BrushingEvent.Action} action
 * @constructor
 */
vs.ui.BrushingEvent = function(source, data, selectedRow, action) {
  /**
   * @type {vs.ui.VisHandler}
   */
  this['source'] = source;

  /**
   * @type {vs.models.DataSource}
   */
  this['data'] = data;

  /**
   * @type {vs.models.DataRow}
   */
  this['selectedRow'] = selectedRow;

  /**
   * @type {vs.ui.BrushingEvent.Action}
   */
  this['action'] = action;
};

/**
 * @enum {string}
 */
vs.ui.BrushingEvent.Action = {
  'MOUSEOVER': 'mouseover',
  'MOUSEOUT': 'mouseout',
  'SELECT': 'select',
  'DESELECT': 'deselect'
};


goog.provide('vs.ui.decorators.Brushing');

goog.require('vs.ui.BrushingEvent');
goog.require('vs.ui.Decorator');
goog.require('vs.ui.Setting');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Brushing = function($ng, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);

  /**
   * @type {u.Event.<vs.ui.BrushingEvent>}
   * @private
   */
  this._brushing = new u.Event();
};

goog.inherits(vs.ui.decorators.Brushing, vs.ui.Decorator);

/**
 * @type {u.Event.<vs.ui.BrushingEvent>}
 * @name vs.ui.decorators.Brushing#brushing
 */
vs.ui.decorators.Brushing.prototype.brushing;

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.decorators.Brushing.Settings = {};

Object.defineProperties(vs.ui.decorators.Brushing.prototype, {
  'settings': { get: /** @type {function (this:vs.ui.decorators.Brushing)} */ (function() { return vs.ui.decorators.Brushing.Settings; })},
  'brushing': { get: /** @type {function (this:vs.ui.decorators.Brushing)} */ (function() { return this._brushing; })}
});

/**
 * @param {vs.ui.BrushingEvent} e
 */
vs.ui.decorators.Brushing.prototype.brush = function(e) {};


goog.provide('vs.ui.svg.SvgBrushing');

goog.require('vs.ui.decorators.Brushing');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Brushing
 */
vs.ui.svg.SvgBrushing = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Brushing.apply(this, arguments);

  /**
   * @type {Array.<vs.models.DataRow>}
   * @private
   */
  this._newDataItems = null;
};

goog.inherits(vs.ui.svg.SvgBrushing, vs.ui.decorators.Brushing);

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgBrushing.prototype.beginDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    var target = self['target'];
    var svg = d3.select(target['$element'][0]).select('svg');
    var viewport = svg.empty() ? null : svg.select('.viewport');
    if (viewport == null || viewport.empty()) {
      // In this case, all items are new, so we return immediately
      self._newDataItems = null;
      resolve();
      return;
    }

    var items = self['data'].asDataRowArray();
    var newItems = viewport.selectAll('.vs-item').data(items, vs.models.DataSource.key).enter();
    self._newDataItems = newItems.empty() ? [] : newItems[0].filter(function(item) { return item; }).map(function(item) { return item['__data__']; });
    resolve();
  });
};

/**
 * @returns {Promise}
 */
vs.ui.svg.SvgBrushing.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['data']['isReady']) { resolve(); return; }

    var target = self['target'];
    var data = self['data'];

    var newItems = null;
    var viewport = d3.select(target['$element'][0]).select('svg').select('.viewport');
    if (!self._newDataItems) {
      newItems = viewport.selectAll('.vs-item');
    } else {
      newItems = viewport.selectAll('.vs-item').data(self._newDataItems, vs.models.DataSource.key);
    }

    newItems
      .on('mouseover', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['MOUSEOVER']));
      })
      .on('mouseout', function (d) {
        self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['MOUSEOUT']));
      })
      .on('click', function (d) {
        //self['brushing'].fire(new vs.ui.BrushingEvent(target, data, d, vs.ui.BrushingEvent.Action['SELECT']));
        d3.event.stopPropagation();
      });

    resolve();
  }).then(function() {
      return vs.ui.decorators.Brushing.prototype.endDraw.apply(self, args);
    });
};

/**
 * @param {vs.ui.BrushingEvent} e
 */
vs.ui.svg.SvgBrushing.prototype.brush = function(e) {
  var target = this['target'];
  var svg = d3.select(target['$element'][0]).select('svg');
  var viewport = svg.empty() ? null : svg.select('.viewport');
  if (viewport == null || viewport.empty()) { return; }

  // TODO: Use LinkService!

  if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOVER']) {
    var items = viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key);
    items
      .style('stroke', '#ffc600')
      .style('stroke-width', '2');
    $(items[0]).appendTo($(viewport[0]));
  } else if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOUT']) {
    viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key)
      .style('stroke', 'none');
  }
};


goog.provide('vs.ui.canvas.CanvasBrushing');

goog.require('vs.ui.decorators.Brushing');
goog.require('vs.models.Transformer');

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @constructor
 * @extends vs.ui.decorators.Brushing
 */
vs.ui.canvas.CanvasBrushing = function($ng, $targetElement, target, options) {
  vs.ui.decorators.Brushing.apply(this, arguments);

  /**
   * @type {Promise}
   * @private
   */
  this._initialized = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._brushingCanvas = null;
};

goog.inherits(vs.ui.canvas.CanvasBrushing, vs.ui.decorators.Brushing);

vs.ui.canvas.CanvasBrushing.prototype.beginDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.decorators.Brushing.prototype.beginDraw.apply(self, args).then(function() {

      resolve();
    });
  });
};

vs.ui.canvas.CanvasBrushing.prototype.endDraw = function() {
  var self = this;
  var args = arguments;

  if (this._initialized == null) {
    this._initialized = new Promise(function(resolve, reject) {

      var target = self['target'];

      if (!self._brushingCanvas) {
        var canvas = goog.string.format('<canvas width="%s" height="%s" style="display: none; position: absolute; bottom: 0; left: 0;"></canvas>',
          /** @type {number} */ (target.optionValue('width')), /** @type {number} */ (target.optionValue('height')));

        self._brushingCanvas = $(canvas);
        self._brushingCanvas.appendTo(target['$element']);
      }

      var activeCanvas = target['activeCanvas'][0];
      var selectedItem = null;
      var mousemove = function(evt) {
        var rect = activeCanvas.getBoundingClientRect();
        var mousePos = {
          x: evt.clientX - rect.left,
          y: evt.clientY - rect.top
        };

        var data = self['data'];

        var items = target.getItemsAt(mousePos.x, mousePos.y);
        if (selectedItem && (items.length == 0 || items[0] != selectedItem)) {
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, selectedItem, vs.ui.BrushingEvent.Action['MOUSEOUT']));
          selectedItem = null;
        }
        if (items.length > 0 && selectedItem != items[0]) {
          selectedItem = items[0];
          self['brushing'].fire(new vs.ui.BrushingEvent(target, data, items[0], vs.ui.BrushingEvent.Action['MOUSEOVER']));
        }
      };
      activeCanvas.addEventListener('mousemove', mousemove);
      self._brushingCanvas[0].addEventListener('mouseover', mousemove);
      self._brushingCanvas[0].addEventListener('mousemove', mousemove);

      if (target['doubleBuffer']) {
        var pendingCanvas = target['pendingCanvas'][0];
        pendingCanvas.addEventListener('mousemove', mousemove);
      }

      resolve();
    });
  }

  return this._initialized.then(function() {
    return vs.ui.decorators.Brushing.prototype.endDraw.apply(self, args);
  });
};

/**
 * @param {vs.ui.BrushingEvent} e
 */
vs.ui.canvas.CanvasBrushing.prototype.brush = function(e) {
  var target = this['target'];
  this._brushingCanvas
    .attr('width', target.optionValue('width'))
    .attr('height', target.optionValue('height'));

  var context = this._brushingCanvas[0].getContext('2d');
  context.drawImage(target['activeCanvas'][0], 0, 0);

  /*var target = this['target'];
  var svg = d3.select(target['$element'][0]).select('svg');
  var viewport = svg.empty() ? null : svg.select('.viewport');
  if (viewport == null || viewport.empty()) { return; }*/

  // TODO: Use LinkService!

  if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOVER']) {
    target.drawHighlightItem(this._brushingCanvas, e['selectedRow']);
    /*var items = viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key);
    items
      .style('stroke', '#ffc600')
      .style('stroke-width', '2');
    $(items[0]).appendTo($(viewport[0]));*/
    this._brushingCanvas.css('display', 'block');
  } else if (e['action'] == vs.ui.BrushingEvent.Action['MOUSEOUT']) {
    //this._brushingCanvas.css({ 'display': 'none' });
    /*viewport.selectAll('.vs-item').data([e['selectedRow']], vs.models.DataSource.key)
      .style('stroke', 'none');*/
  }
};


goog.provide('vs.directives.Brushing');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.svg.SvgBrushing');
goog.require('vs.ui.canvas.CanvasBrushing');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @param $rootScope Angular root scope
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Brushing = function($scope, taskService, $timeout, $rootScope) {
  vs.directives.GraphicDecorator.apply(this, [$scope, taskService, $timeout, true /* Overrides VisHandler */]);

  /**
   * Angular root scope
   * @private
   */
  this._$rootScope = $rootScope;
};

goog.inherits(vs.directives.Brushing, vs.directives.GraphicDecorator);

vs.directives.Brushing.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.GraphicDecorator.prototype.link.apply(this, arguments);

  this['handler']['brushing'].addListener(function(e) {
    this._$rootScope.$broadcast('brushing', e);
  }, this);

  var self = this;
  $scope.$on('brushing', function(e, brushingEvent) {
    self['handler'].brush(brushingEvent);
  });
};

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Brushing.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgBrushing($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasBrushing($ng, $targetElement, target, options);
  }
  return null;
};


goog.provide('vs.ui.canvas.CanvasVis');

goog.require('vs.ui.VisHandler');

goog.require('goog.string.format');

/**
 * @constructor
 * @extends {vs.ui.VisHandler}
 */
vs.ui.canvas.CanvasVis = function () {
  vs.ui.VisHandler.apply(this, arguments);
};

goog.inherits(vs.ui.canvas.CanvasVis, vs.ui.VisHandler);

/**
 * @type {Object.<string, vs.ui.Setting>}
 */
vs.ui.canvas.CanvasVis.Settings = u.extend({}, vs.ui.VisHandler.Settings, {
  'doubleBuffer': vs.ui.Setting.PredefinedSettings['doubleBuffer']
});

/**
 * @type {jQuery}
 * @name vs.ui.canvas.CanvasVis#pendingCanvas
 */
vs.ui.canvas.CanvasVis.prototype.pendingCanvas;

/**
 * @type {jQuery}
 * @name vs.ui.canvas.CanvasVis#activeCanvas
 */
vs.ui.canvas.CanvasVis.prototype.activeCanvas;

/**
 * @type {boolean}
 * @name vs.ui.canvas.CanvasVis#doubleBuffer
 */
vs.ui.canvas.CanvasVis.prototype.doubleBuffer;

Object.defineProperties(vs.ui.canvas.CanvasVis.prototype, {
  'render': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return 'canvas'; })},
  'settings': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return vs.ui.canvas.CanvasVis.Settings; })},
  'doubleBuffer': {
    get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this.optionValue('doubleBuffer'); }),
    set: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function(value) { return this['options']['doubleBuffer'] = value; })
  },
  'pendingCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this['doubleBuffer'] ? this['$element'].find('canvas').filter(':hidden') : this['$element'].find('canvas'); })},
  'activeCanvas': { get: /** @type {function (this:vs.ui.canvas.CanvasVis)} */ (function() { return this['doubleBuffer'] ? this['$element'].find('canvas').filter(':visible') : this['$element'].find('canvas'); })}
});

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasVis.prototype.beginDraw = function () {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args).then(
      function() {
        var pendingCanvas = self['pendingCanvas'];
        if (pendingCanvas.length == 0) {
          var format = goog.string.format('<canvas width="%s" height="%s" style="display: %%s"></canvas>',
            /** @type {number} */ (self.optionValue('width')), /** @type {number} */ (self.optionValue('height')));
          $(goog.string.format(format, 'block') + (self['doubleBuffer'] ? goog.string.format(format, 'none') : '')).appendTo(self['$element']);
          pendingCanvas = self['pendingCanvas'];
        }

        pendingCanvas
          .attr('width', self.optionValue('width'))
          .attr('height', self.optionValue('height'));

        var context = pendingCanvas[0].getContext('2d');
        context.translate(0.5,0.5);
        context.rect(0, 0, self.optionValue('width'), self.optionValue('height'));
        context.fillStyle = '#ffffff';
        context.fill();
        resolve();
      }, reject);
  });
};

/**
 * @returns {Promise}
 */
vs.ui.canvas.CanvasVis.prototype.endDraw = function() {
  var self = this;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    if (!self['doubleBuffer']) { resolve(); return; }
    var activeCanvas = self['activeCanvas'];
    var pendingCanvas = self['pendingCanvas'];
    activeCanvas.css({ 'display': 'none' });
    pendingCanvas.css({ 'display': 'block' });
    resolve();
  }).then(function() {
    return vs.ui.VisHandler.prototype.endDraw.apply(self, args);
  });
};

/**
 * @param {number} x
 * @param {number} y
 * @returns {Array.<vs.models.DataRow>}
 */
vs.ui.canvas.CanvasVis.prototype.getItemsAt = function(x, y) { return []; };

/**
 * @param {jQuery} canvas
 * @param {vs.models.DataRow} d
 */
vs.ui.canvas.CanvasVis.prototype.drawHighlightItem = function(canvas, d) {};

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} [fill]
 * @param {string} [stroke]
 * @param {number} [strokeWidth]
 */
vs.ui.canvas.CanvasVis.circle = function(context, cx, cy, r, fill, stroke, strokeWidth) {
  context.beginPath();
  context.arc(cx, cy, r, 0, 2 * Math.PI);

  if (stroke) {
    context.strokeStyle = stroke;
    context.lineWidth = strokeWidth || 0;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }

  context.closePath();
};


goog.provide('vs');

goog.require('vs.Configuration');

goog.require('vs.async.TaskService');

goog.require('vs.async.ThreadPoolService');

goog.require('vs.ui.VisualizationFactory');

goog.require('vs.ui.VisHandler');

goog.require('vs.ui.svg.SvgVis');
goog.require('vs.ui.canvas.CanvasVis');

goog.require('vs.directives.Visualization');

goog.require('vs.models.DataRow');
goog.require('vs.models.Transformer');
goog.require('vs.models.GenomicRangeQuery');

goog.require('vs.directives.Axis');
goog.require('vs.directives.Grid');
goog.require('vs.directives.Brushing');

goog.require('vs.directives.Window');
goog.require('vs.directives.Movable');
goog.require('vs.directives.Resizable');

goog.require('vs.directives.LoadingDecorator');

goog.require('vs.directives.DataContext');

vs.main = angular.module('vs', []);

vs.main.provider('configuration', function() {
  var self = this;
  self.__proto__ = new vs.Configuration();
  self.$get = function() { return self; };
});

vs.main.factory('taskService', ['$timeout', function($timeout) {
  return new vs.async.TaskService($timeout);
}]);

vs.main.factory('threadPool', ['configuration', function(config) {
  return new vs.async.ThreadPoolService(config);
}]);

vs.main.factory('visualizationFactory', ['configuration', 'taskService', '$timeout', 'threadPool', function(configuration, taskService, $timeout, threadPool) {
  return new vs.ui.VisualizationFactory(configuration, taskService, $timeout, threadPool);
}]);

vs.main.directive('visualization', ['visualizationFactory', 'taskService', function(visualizationFactory, taskService) {
  return vs.directives.Directive.createNew('visualization', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Visualization), [visualizationFactory, taskService], {restrict: 'C'});
}]);

vs.main.directive('vsDataContext', ['$templateCache', function($templateCache) {
  return vs.directives.Directive.createNew('vsDataContext', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.DataContext), [$templateCache], {restrict: 'C', transclude: true, template: '<ng-transclude></ng-transclude><div ng-include="vsDataContext.handler.template"></div>'});
}]);

vs.main.directive('vsWindow', function() {
  return vs.directives.Directive.createNew('vsWindow', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Window), null, {restrict: 'C'});
});

vs.main.directive('vsMovable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsMovable', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Movable), [$document], {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsResizable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsResizable', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Resizable), [$document], {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsLoader', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsLoader', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.LoadingDecorator), [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsAxis', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsAxis', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Axis), [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsGrid', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsGrid', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Grid), [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsBrushing', ['taskService', '$timeout', '$rootScope', function(taskService, $timeout, $rootScope) {
  return vs.directives.Directive.createNew('vsBrushing', /** @type {function(new:vs.directives.Directive)} */ (vs.directives.Brushing), [taskService, $timeout, $rootScope], {restrict: 'C', require: '^visualization'});
}]);



/*
// TODO: Later
vs.main.directive('vs-input-data', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});

// TODO: Later
vs.main.directive('vs-options', function() {
  return {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
    },
    link: function(scope, element, attrs, visualizationCtrl) {
      //visualizationCtrl.addPane(scope);
    }
  };
});
*/

vs.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});

vs.main.run(['$timeout', function($timeout) {
  // u.Event.TIMEOUT = $timeout;
}]);


