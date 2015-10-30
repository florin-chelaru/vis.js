/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 5:45 PM
 */

goog.provide('vs.plugins.deprecated.BigwigDataContext');

goog.require('vs.ui.DataContext');
goog.require('vs.models.DataSource');
goog.require('vs.models.Query');

/**
 * @param {{visualizations: (Array.<vs.ui.VisualContext>|undefined), children: (Array.<vs.ui.DataContext>|undefined), name: (string|undefined)}} options
 * @param {Object.<string, string>} bigwigFileNames
 * @param {string} [proxyEndpoint]
 * @constructor
 * @extends {vs.ui.DataContext}
 */
vs.plugins.deprecated.BigwigDataContext = function(options, bigwigFileNames, proxyEndpoint) {
  vs.ui.DataContext.prototype.apply(this, options);

  /**
   * @type {Object.<string, string>}
   * @private
   */
  this.bigwigFileNames = bigwigFileNames;

  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = null;

  /**
   * @type {Promise}
   * @private
   */
  this._queryPromise = null;

  /**
   * @type {u.Event.<vs.models.DataSource>}
   * @private
   */
  this._dataChanged = new u.Event();

  this._bigwigFiles = {};
  var self = this;
  u.each(bigwigFileNames, function(label, uri) {
    self._bigwigFiles[label] = new bigwig.BigwigFile(uri, proxyEndpoint);
  });

  // data format:
  // rows: chr, start, end
  // cols: Object.keys(bigwigFiles)
  // vals: Array.prototype.concat.apply([], [values1, values2, ...])
};

/**
 * @type {string}
 * @name vs.plugins.deprecated.BigwigDataContext#name
 */
vs.plugins.deprecated.BigwigDataContext.prototype.name;

/**
 * @type {vs.models.DataSource}
 * @name vs.plugins.deprecated.BigwigDataContext#data
 */
vs.plugins.deprecated.BigwigDataContext.prototype.data;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.plugins.deprecated.BigwigDataContext#dataChanged
 */
vs.plugins.deprecated.BigwigDataContext.prototype.dataChanged;

Object.defineProperties(vs.plugins.deprecated.BigwigDataContext.prototype, {
  name: {
    get: /** @type {function (this:vs.plugins.deprecated.BigwigDataContext)} */ (function() { return this._name; })
  },

  data: {
    get: /** @type {function (this:vs.plugins.deprecated.BigwigDataContext)} */ (function() { throw new u.AbstractMethodException(); }),
    set: /** @type {function (this:vs.plugins.deprecated.BigwigDataContext)} */ (function(value) { throw new u.AbstractMethodException(); })
  },

  dataChanged: {
    get: /** @type {function (this:vs.plugins.deprecated.BigwigDataContext)} */ (function() { return this._dataChanged; })
  }
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} q
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.plugins.deprecated.BigwigDataContext.prototype.query = function(q) {
  var self = this;

  var deferred = function(resolve, reject) {
    var d = {
      query: q,
      nrows: 2,
      ncols: Object.keys(self._bigwigFileNames).length,
      rows: [
        { label: 'start', d: [10,12] },
        { label: 'end', d: [15,16] },
        { label: 'chr', d: [1,1] }
      ],
      cols: [
        { label: 'name', d: Object.keys(self._bigwigFileNames) }
      ],

      vals: [
        {
          label: 'value',
          d: u.array.range(Object.keys(self._bigwigFileNames).length * 2).map(function(i) { return Math.random(); }),
          boundaries: { min: 0, max: 1 }
        }
      ]
    };
    var data = u.reflection.wrap(d, vs.models.DataSource);
    self._data = data;
    resolve(data);
    self._dataChanged.fire(data);
  };

  if (!this._queryPromise) {
    this._queryPromise = new Promise(deferred);
    return this._queryPromise;
  }

  return this._queryPromise
    .then(function(data) {
      if (q.equals(data.query)) { return self._queryPromise; }
      self._queryPromise = new Promise(deferred);
      return self._queryPromise;
    });
};
