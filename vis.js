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


goog.provide('vs.models.Query');

/**
 * @param {({target: (vs.models.Query.Target|string), targetLabel: string, test: (vs.models.Query.Test|string), testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} opts
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
 * @param {({target: (vs.models.Query.Target|string), targetLabel: string, test: (vs.models.Query.Test|string), testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} [other]
 * @returns {boolean}
 */
vs.models.Query.prototype.equals = function(other) {
  if (!other) { return false; }
  var q = new vs.models.Query(other);
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


goog.provide('vs.models.DataSource');

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
   * @type {boolean|null|undefined}
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
  'changed': {
    get: /** @type {function (this:vs.models.DataSource)} */ (function() {
      if (!this._changed) { this._changed = new u.Event(); }
      return this._changed;
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
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.models.DataSource.prototype.applyQuery = function(queries) {
  if (queries instanceof vs.models.Query) { queries = [queries]; }
  if (!queries || !queries.length) { return /** @type {Promise} */ (Promise.resolve(this)); }

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
      switch (q['target']) {
        case vs.models.Query.Target['VALS']:
          targetArr = ret.getVals(q['targetLabel']);
          break;
        case vs.models.Query.Target['ROWS']:
          targetArr = ret.getRow(q['targetLabel']);
          break;
        case vs.models.Query.Target['COLS']:
          targetArr = ret.getCol(q['targetLabel']);
          break;
      }

      var indices = u.array.range(targetArr['d'].length)
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
            query: ret['query'].concat([q]),
            nrows: indices.length,
            ncols: ret['ncols'],
            rows: ret['rows'].map(function (arr) {
              return u.reflection.wrap({
                label: arr['label'],
                boundaries: arr['boundaries'],
                d: indices.map(function (i) {
                  return arr['d'][i]
                })
              }, vs.models.DataArray);
            }),
            cols: ret['cols'],
            vals: ret['vals'].map(function (arr) {
              return u.reflection.wrap({
                label: arr['label'],
                boundaries: arr['boundaries'],
                d: ret['cols'].map(function (col, j) {
                  return indices.map(function (i) {
                    return arr['d'][j * ret['nrows'] + i];
                  })
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                })
              }, vs.models.DataArray);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target['COLS']:
          ret = u.reflection.wrap({
            query: ret['query'].concat([q]),
            nrows: ret['nrows'],
            ncols: indices.length,
            rows: ret['rows'],
            cols: ret['cols'].map(function (arr) {
              return u.reflection.wrap({
                label: arr['label'],
                boundaries: arr['boundaries'],
                d: indices.map(function (i) {
                  return arr['d'][i]
                })
              }, vs.models.DataArray);
            }),
            vals: ret['vals'].map(function (arr) {
              return u.reflection.wrap({
                label: arr['label'],
                boundaries: arr['boundaries'],
                d: indices.map(function (i) {
                  return arr['d'].slice(i * ret['nrows'], (i + 1) * ret['nrows']);
                }).reduce(function (arr1, arr2) {
                  return arr1.concat(arr2);
                })
              }, vs.models.DataArray);
            })
          }, vs.models.DataSource);
          break;

        case vs.models.Query.Target['VALS']:
          ret = u.reflection.wrap({
            query: ret['query'].concat([q]),
            nrows: ret['nrows'],
            ncols: ret['ncols'],
            rows: ret['rows'],
            cols: ret['cols'],
            vals: ret['vals'].map(function (arr) {
              var filtered = u.array.fill(arr['d'].length, undefined);
              indices.forEach(function (i) {
                filtered[i] = arr['d'][i];
              });
              return u.reflection.wrap({
                label: arr['label'],
                boundaries: arr['boundaries'],
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

  this._data['changed'].addListener(this.draw, this);

  // Data ready for the first time
  var self = this;
  this._data['ready'].then(function() { self.draw(); });

  // Options changed
  this._$scope.$watch(
    function(){ return self._options; },
    function() { self.draw(); },
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
  'render': { get: function() { throw new u.UnimplementedException('Property "render" does not exist in data source'); }},
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
vs.ui.VisHandler.prototype.beginDraw = function() { /*console.log('Vis.beginDraw'); */return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.endDraw = function() { /*console.log('Vis.endDraw'); */return Promise.resolve(); };

/**
 * @returns {Promise}
 */
vs.ui.VisHandler.prototype.draw = function() {
  var self = this;
  var lastDraw = this._lastDraw;
  if (!this._lastDrawFired) { return lastDraw; }

  this._lastDrawFired = false;
  var promise = new Promise(function(resolve, reject) {
    var taskService = self._taskService;

    // Since we chose to run draw tasks sequentially, there is no need to queue them using promises.
    // The beginDraw and draw must run one after the other, with no delay in between, so this is a temporary fix for that problem.
    // TODO: Create an entirely new chain, containing both the beginDraw and draw tasks and run that instead.
    /*lastDraw
     .then(function() { return taskService.runChain(self['beginDrawTask']); })
     .then(function() { return taskService.runChain(self['endDrawTask']); })
     .then(resolve);*/

    Promise.resolve()
      .then(function() { taskService.runChain(self['beginDrawTask'], true); })
      .then(function() { taskService.runChain(self['endDrawTask'], true); })
      .then(function() { self._lastDrawFired = true; })
      .then(resolve, reject);
  });
  this._lastDraw = promise;
  return promise;
};

/**
 */
vs.ui.VisHandler.prototype.scheduleRedraw = function() {
  // This will trigger an asynchronous angular digest
  this._$timeout.call(null, function() {}, 0);
};


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


goog.provide('vs.models.DataRow');

goog.require('vs.models.DataSource');

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
 * @type {{pre: function(angular.Scope, jQuery, angular.Attributes, (*|undefined)), post: function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
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
    vs.ui.VisHandler.prototype.beginDraw.apply(self, args)
      .then(
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

vs.ui.canvas.CanvasVis.prototype.finalizeDraw = function() {
  if (!this['doubleBuffer']) { return; }
  var activeCanvas = this['activeCanvas'];
  var pendingCanvas = this['pendingCanvas'];
  activeCanvas.css({ 'display': 'none' });
  pendingCanvas.css({ 'display': 'block' });
};

/**
 * @override
 */
vs.ui.canvas.CanvasVis.prototype.draw = function() {
  var self = this;
  return vs.ui.VisHandler.prototype.draw.apply(this, arguments)
    .then(function() { self.finalizeDraw(); });
};

/**
 * @param {CanvasRenderingContext2D} context
 * @param {number} cx
 * @param {number} cy
 * @param {number} r
 * @param {string} [fill]
 * @param {string} [stroke]
 */
vs.ui.canvas.CanvasVis.circle = function(context, cx, cy, r, fill, stroke) {
  context.beginPath();
  context.arc(cx, cy, r, 0, 2 * Math.PI);

  if (stroke) {
    context.strokeStyle = stroke;
    context.stroke();
  }

  if (fill) {
    context.fillStyle = fill;
    context.fill();
  }

  context.closePath();
};


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


goog.provide('vs.directives.Visualization');

goog.require('vs.directives.Directive');
goog.require('vs.ui.VisualizationFactory');
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
 * @type {{pre: function(angular.Scope, jQuery, angular.Attributes, (*|undefined)), post: function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
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
    $element.resize(function(event) {
      self._handler['options']['width'] = event['width'];
      self._handler['options']['height'] = event['height'];
      if (!$scope.$$phase) { $scope.$apply(); }
    });
  }
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

/*

goog.require('vs.directives.Axis');
goog.require('vs.directives.Grid');
*/

/*

goog.require('vs.directives.Window');
goog.require('vs.directives.Movable');
goog.require('vs.directives.Resizable');
goog.require('vs.directives.Navbar');
goog.require('vs.directives.NavLocation');
*/

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

/*

vs.main.directive('vsWindow', function() {
  return vs.directives.Directive.createNew('vsWindow', vs.directives.Window, null, {restrict: 'C'});
});

vs.main.directive('vsMovable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsMovable', vs.directives.Movable, [$document], {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsResizable', ['$document', function($document) {
  return vs.directives.Directive.createNew('vsResizable', vs.directives.Resizable, [$document], {restrict: 'C', require: 'vsWindow'});
}]);

vs.main.directive('vsNavbar', [function() {
  return vs.directives.Directive.createNew('vsNavbar', vs.directives.Navbar, null, {restrict: 'C', require: ['vsWindow', 'vsDataContext']});
}]);

vs.main.directive('vsNavLocation', [function() {
  return vs.directives.Directive.createNew('vsNavLocation', vs.directives.NavLocation, null, {restrict: 'C', require: ['vsNavbar', 'vsDataContext']});
}]);
*/

/*

vs.main.directive('vsAxis', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsAxis', vs.directives.Axis, [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);

vs.main.directive('vsGrid', ['taskService', '$timeout', function(taskService, $timeout) {
  return vs.directives.Directive.createNew('vsGrid', vs.directives.Grid, [taskService, $timeout], {restrict: 'C', require: '^visualization'});
}]);
*/


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

