/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/29/2015
 * Time: 3:51 PM
 */

goog.provide('vs.plugins.BigwigDataSource');

goog.require('vs.models.DataSource');
goog.require('vs.models.Query');

/**
 * @param {Array.<vs.models.Query>|vs.models.Query} [initialQuery]
 * @constructor
 * @extends {vs.models.DataSource}
 */
vs.plugins.BigwigDataSource = function(initialQuery) {
  vs.models.DataSource.apply(this, arguments);

  /**
   * @type {boolean}
   * @private
   */
  this._isReady = false;
  var self = this;

  /**
   * @type {Promise}
   * @private
   */
  this._ready = new Promise(function(resolve, reject) {
    setTimeout(function () {
      u.extend(self, {
        query: [
          new vs.models.Query({target: 'rows', targetLabel: 'chr', test: '==', testArgs: 'chr1'}),
          new vs.models.Query({target: 'rows', targetLabel: 'start', test: '<', testArgs: 20}),
          new vs.models.Query({target: 'rows', targetLabel: 'end', test: '>', testArgs: 10})
        ],
        nrows: 4,
        ncols: 2,
        cols: [
          {label: 'name', d: ['florin', 'suze', 'wouter', 'apas']},
          {label: 'id', d: [1, 2, 3, 4]},
          {label: 'age', d: [30, 24, 35, 22]},
          {label: 'sex', d: ['m', 'f', 'm', 'm']}
        ],
        rows: [
          {label: 'name', d: ['gene1', 'gene2']},
          {label: 'id', d: [1, 2]},
          {label: 'start', d: [10, 12]},
          {label: 'end', d: [15, 16]},
          {label: 'chr', d: ['chr1', 'chr1']}
        ],
        vals: [
          {
            label: 'gene expression',
            d: [0.67, 0.309, 0.737, 0.688, 0.011, 0.303, 0.937, 0.06],
            boundaries: {min: 0, max: 1}
          },
          {
            label: 'dna methylation',
            d: [0.625, 0.998, 0.66, 0.595, 0.254, 0.849, 0.374, 0.701],
            boundaries: {min: 0, max: 1}
          }
        ]
      });
      self._isReady = true;
      resolve(self);
    }, 2000);
  });
};

goog.inherits(vs.plugins.BigwigDataSource, vs.models.DataSource);

Object.defineProperties(vs.plugins.BigwigDataSource.prototype, {
  isReady: { get: /** @type {function (this:vs.plugins.BigwigDataSource)} */ (function() { return this._isReady; })}
});
