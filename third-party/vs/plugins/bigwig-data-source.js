/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/29/2015
 * Time: 3:51 PM
 */

goog.provide('vs.plugins.BigwigDataSource');

goog.require('vs.models.DataSource');
goog.require('vs.models.Query');
goog.require('vs.models.ModelsException');

/**
 * TODO: Add option to load additional col metadata (metadata about each file/track),
 * TODO: and also more metadata about rows (each snip for example)
 * TODO: And labels for values (pval, etc)
 * @param {Array.<string>} bigwigURIs
 * @param {{initialQuery: (vs.models.Query|Array.<vs.models.Query>|undefined), proxyURI: (string|undefined), valsLabel: (string|undefined)}} options
 * @constructor
 * @extends {vs.models.DataSource}
 */
vs.plugins.BigwigDataSource = function(bigwigURIs, options) {
  vs.models.DataSource.apply(this, arguments);

  /**
   * @type {boolean}
   * @private
   */
  this._isReady = false;

  /**
   * @type {Array.<vs.models.Query>}
   * @private
   */
  this.query = options.initialQuery ? (Array.isArray(options.initialQuery) ? options.initialQuery : [options.initialQuery]) : [];

  /**
   * @type {string|undefined}
   * @private
   */
  this._proxyURI = options.proxyURI;

  /**
   * @type {number}
   * @private
   */
  this.nrows = null;

  /**
   * @type {number}
   * @private
   */
  this.ncols = null;

  /**
   * @type {Array.<vs.models.DataArray>}
   * @private
   */
  this.rows = null;

  /**
   * @type {Array.<vs.models.DataArray>}
   * @private
   */
  this.cols = null;

  /**
   * @type {Array.<vs.models.DataArray>}
   * @private
   */
  this.vals = null;

  /**
   * @type {number}
   * @private
   */
  this._maxItems = 5000;

  var self = this;
  /**
   * @type {Promise}
   * @private
   */
  this._ready = new Promise(function(resolve, reject) {
    var ncols = bigwigURIs.length;
    var cols = {
      label: bigwigURIs.map(function(uri) { return uri.substr(Math.max(uri.lastIndexOf('/'), 0)).replace('.bigwig', '').replace('.bw', ''); })
    };

    var rowLabels = ['chr', 'start', 'end'];
    var chrValidTests = ['==']; // TODO: Later, add support for all others. Shouldn't be that hard, if we use the ChrTree
    var bpValidTests = ['<', '>='];

    var rowQueries = self.query.filter(function(q) {
      if (q.target != vs.models.Query.Target.ROWS) { return false; }
      if (rowLabels.indexOf(q.targetLabel) < 0) {
        console.warn('The row label ' + q.targetLabel + ' is not valid. Valid options for row labels are: ' + JSON.stringify(rowLabels));
        return false;
      }
      if (q.targetLabel == 'chr' && chrValidTests.indexOf(q.test) < 0) {
        console.warn('The ' + q.test + ' operation is not yet supported for chromosomes by the bigwig library; supported operations are: ' + JSON.stringify(chrValidTests));
        return false;
      }
      if ((q.targetLabel == 'start' || q.targetLabel == 'end') && bpValidTests.indexOf(q.test) < 0) {
        console.warn('The ' + q.test + ' operation is not yet supported for start/end positions by the bigwig library; supported operations are: ' + JSON.stringify(bpValidTests));
        return false;
      }
      if (q.targetLabel == 'start' && (q.test == '>=' || (q.test == '<' && q.negate))) {
        console.warn('The only supported test for "start" is "<"');
        return false;
      }
      if (q.targetLabel == 'end' && (q.test == '<'|| (q.test == '>=' && q.negate))) {
        console.warn('The only supported test for "end" is ">="');
        return false;
      }

      return q.target == vs.models.Query.Target.ROWS;
    });

    var chrQueries = rowQueries.filter(function(q) { return q.targetLabel == 'chr' && !q.negate; });
    var startEndQueries = rowQueries.filter(function(q) { return q.targetLabel == 'start' || q.targetLabel == 'end' });
    var greaterThanQueries = startEndQueries.filter(function(q) { return q.test == '>=' || (q.negate && q.test == '<'); });
    var lessThanQueries = startEndQueries.filter(function(q) { return q.test == '<' || (q.negate && q.test == '>='); });

    if (rowQueries.length > 0 && chrQueries.length != 1) {
      throw new vs.models.ModelsException('Bigwig valid queries must either be empty, or contain exactly one "chr == " test');
    }
    if (rowQueries.length > 0 && startEndQueries.length < 2) {
      throw new vs.models.ModelsException('Bigwig valid queries must either be empty, or contain at least two "start/end < or >= " tests');
    }
    if (rowQueries.length > 0 && (lessThanQueries.length < 1 || greaterThanQueries.length < 1)) {
      throw new vs.models.ModelsException('Bigwig valid queries must either be empty, or contain a finite start/end range');
    }

    var range = rowQueries.length == 0 ? undefined : {
      chr: chrQueries[0].testArgs,
      end: startEndQueries.filter(function(q) { return q.targetLabel == 'start'; }).map(function(q) { return q.testArgs; }).reduce(function(v1, v2) { return Math.min(v1, v2); }),
      start: startEndQueries.filter(function(q) { return q.targetLabel == 'end'; }).map(function(q) { return q.testArgs; }).reduce(function(v1, v2) { return Math.max(v1, v2); })
    };


    var bwFiles = bigwigURIs.map(function(uri) { return new bigwig.BigwigFile(uri, self._proxyURI, 256); });


    var rows = {};
    var v = new Array(bwFiles.length);

    u.async.each(bwFiles,
      /**
       * @param {bigwig.BigwigFile} bwFile
       * @param {number} i
       */
      function(bwFile, i) {
        return new Promise(function(resolve, reject) {
          bwFile.query(range, {maxItems: self._maxItems})
            .then(/** @param {Array.<bigwig.DataRecord>} records */ function(records) {
              if (!rows.chr) {
                rows.chr = records.map(function(r) { return r.chrName; });
                rows.start = records.map(function(r) { return r.start; });
                rows.end = records.map(function(r) { return r.end; });
              }
              if (rows.chr.length < records.length) {
                records = records.slice(0, rows.chr.length);
              }
              if (records.length < rows.chr.length) {
                rows.chr = rows.chr.slice(0, records.length);
                rows.start = rows.start.slice(0, records.length);
                rows.end = rows.end.slice(0, records.length);
              }
              v[i] = records.map(function(r) { return r.value(bigwig.DataRecord.Aggregate.MAX); });
              resolve();
            });
        });
      }).then(function() {
        var nrows = rows.chr.length;
        var vals = v.reduce(function(v1, v2) { return v1.concat(v2); });

        self.ncols = ncols;
        self.nrows = nrows;
        self.cols = u.map(cols, function(val, key) { return new vs.models.DataArray(val, key); });
        self.rows = u.map(rows, function(val, key) { return new vs.models.DataArray(val, key); });
        self.vals = [new vs.models.DataArray(vals, options.valsLabel || 'v0')];
        self._isReady = true;
        resolve(self);
      });

    /*setTimeout(function () {
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
    }, 2000);*/
  });
};

goog.inherits(vs.plugins.BigwigDataSource, vs.models.DataSource);

Object.defineProperties(vs.plugins.BigwigDataSource.prototype, {
});
