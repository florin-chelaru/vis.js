/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:43 PM
 */

goog.provide('vs.models.DataSource');

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
};

/**
 * @type {string}
 * @name vs.models.DataSource#id;
 */
vs.models.DataSource.prototype.id;

/**
 * @type {string}
 * @name vs.models.DataSource#label;
 */
vs.models.DataSource.prototype.label;

/**
 * An indicator of whether the data has changed or not. Data with the same id and state is considered identical.
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
 * @type {Array.<{label: string, type: (string|undefined), boundaries: (undefined|{min:number, max:number})}>}
 * @name vs.models.DataSource#rowMetadata
 */
vs.models.DataSource.prototype.rowMetadata;

/**
 * @type {Array.<Object>}
 * @name vs.models.DataSource#d
 */
vs.models.DataSource.prototype.d;

/**
 * @type {Object}
 * @name vs.models.DataSource#metadata
 */
vs.models.DataSource.prototype.metadata;

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
      u.async.each(/** @type {Array.<vs.models.Query>} */ (queries), function(query) {
        return new Promise(function(itResolve, itReject) {
          vs.models.DataSource.singleQuery(ret, query)
            .then(function (data) { ret = data; itResolve(); }, itReject);
        });
      }, true)
        .then(function() {
          if (copy) { resolve(ret); }
          else {
            self['id'] = ret['id'];
            self['query'] = ret['query'];
            self['rowMetadata'] = ret['rowMetadata'];
            self['d'] = ret['d'];
            self['metadata'] = ret['metadata'];
            self['label'] = ret['label'];
            self['state'] = ret['state'];
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
      /** @type {Array} */
      var targetArr = data['d'];

      var filtered = u.fast.filter(targetArr,
        function (record, i) {
          var test = true;
          var item = q['target'] != undefined ? record[q['target']] : i;

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
              case vs.models.Query.Test['DEFINED']:
                test = (item !== undefined);
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

      ret = u.reflection.wrap({
        'id': ret['id'],
        'query': ret['query'].concat([q]),
        'rowMetadata': ret['rowMetadata'],
        'metadata': ret['metadata'],
        'd': filtered,
        'label': ret['label'],
        'state': u.generatePseudoGUID(6)
      }, vs.models.DataSource);

      resolve(ret);
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * @returns {{query: *, nrows: *, ncols: *, rows: *, cols: *, vals: *, isReady: *}}
 */
vs.models.DataSource.prototype.raw = function() {
  return {
    'id': this['id'],
    'label': this['label'],
    'query': this['query'],
    'rowMetadata': this['rowMetadata'],
    'metadata': this['metadata'],
    'd': this['d'],
    'state': this['state']
  };
};

/**
 * @param {string} label
 * @returns {{label: string, type: (string|undefined), boundaries: (undefined|{min:number, max:number})}|null}
 */
vs.models.DataSource.prototype.getRowMetadata = function(label) {
  var metadata;
  var some = this['rowMetadata'].some(function(m) {
    metadata = m;
    return m['label'] == label;
  });
  return some ? metadata : null;
};

/**
 * @param {Array.<vs.models.DataSource>} datas
 * @returns {Array.<string>}
 */
vs.models.DataSource.combinedArrayMetadata = function(datas) {
  return u.array.uniqueFast(u.fast.concat(u.fast.map(datas, function(d) { return u.fast.map(d['rowMetadata'], function(m) { return m['label']; }); })));
};

/**
 * @param {Array.<vs.models.DataSource>} datas
 * @returns {boolean}
 */
vs.models.DataSource.allDataIsReady = function(datas) {
  return datas.every(function(d) { return d['isReady']; });
};

/**
 * @enum {string}
 */
vs.models.DataSource.FieldType = {
  'STRING': 'string',
  'NUMBER': 'number',
  'BOOLEAN': 'boolean',
  'FACTOR': 'factor'
};
