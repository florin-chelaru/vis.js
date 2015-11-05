/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/5/2015
 * Time: 1:56 PM
 */

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
      target: vs.models.Query.Target.ROWS,
      targetLabel: 'chr',
      test: vs.models.Query.Test.EQUALS,
      testArgs: chr
    }),
    new vs.models.Query({
      target: vs.models.Query.Target.ROWS,
      targetLabel: 'start',
      test: vs.models.Query.Test.LESS_THAN,
      testArgs: end
    }),
    new vs.models.Query({
      target: vs.models.Query.Target.ROWS,
      targetLabel: 'end',
      test: vs.models.Query.Test.GREATER_OR_EQUALS,
      testArgs: start
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

Object.defineProperties(vs.models.GenomicRangeQuery.prototype, {
  chr: { get: function() { return this._chr; }},
  start: { get: function() { return this._start; }},
  end: { get: function() { return this._end; }},
  query: { get: function() { return this._query; }}
});

vs.models.GenomicRangeQuery.extract = function(query) {
  var rowLabels = ['chr', 'start', 'end'];
  var chrValidTests = ['==']; // TODO: Later, add support for all others. Shouldn't be that hard, if we use the ChrTree
  var bpValidTests = ['<', '>='];

  var rowQueries = query.filter(function(q) {
    if (q.target != vs.models.Query.Target.ROWS) { return false; }
    if (rowLabels.indexOf(q.targetLabel) < 0) { return false; }
    if ((q.targetLabel == 'chr' && chrValidTests.indexOf(q.test) < 0) || q.negate) {
      throw new vs.models.ModelsException('The ' + q.test + ' operation is not yet supported for chromosomes; supported operations are: ' + JSON.stringify(chrValidTests));
    }
    if ((q.targetLabel == 'start' || q.targetLabel == 'end') && bpValidTests.indexOf(q.test) < 0) {
      throw new vs.models.ModelsException('The ' + q.test + ' operation is not yet supported for start/end positions by the bigwig library; supported operations are: ' + JSON.stringify(bpValidTests));
    }
    if (q.targetLabel == 'start' && (q.test == '>=' || (q.test == '<' && q.negate))) {
      throw new vs.models.ModelsException('The only supported test for "start" is "<"');
    }
    if (q.targetLabel == 'end' && (q.test == '<' || (q.test == '>=' && q.negate))) {
      throw new vs.models.ModelsException('The only supported test for "end" is ">="');
    }
    return true;
  });

  var chrQueries = rowQueries.filter(function(q) { return q.targetLabel == 'chr' && !q.negate; });
  var startEndQueries = rowQueries.filter(function(q) { return q.targetLabel == 'start' || q.targetLabel == 'end' });
  var greaterThanQueries = startEndQueries.filter(function(q) { return q.test == '>=' || (q.negate && q.test == '<'); });
  var lessThanQueries = startEndQueries.filter(function(q) { return q.test == '<' || (q.negate && q.test == '>='); });

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
    chr: chrQueries[0].testArgs,
    end: startEndQueries.filter(function(q) { return q.targetLabel == 'start'; }).map(function(q) { return q.testArgs; }).reduce(function(v1, v2) { return Math.min(v1, v2); }),
    start: startEndQueries.filter(function(q) { return q.targetLabel == 'end'; }).map(function(q) { return q.testArgs; }).reduce(function(v1, v2) { return Math.max(v1, v2); })
  };

  return new vs.models.GenomicRangeQuery(range.chr, range.start, range.end);
};
