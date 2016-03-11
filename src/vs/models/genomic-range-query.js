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

  start = parseInt(start, 10);
  end = parseInt(end, 10);

  /**
   * @type {Array.<vs.models.Query>}
   * @private
   */
  this._query = [
    new vs.models.Query({
      'target': 'chr',
      'test': vs.models.Query.Test['EQUALS'],
      'testArgs': chr
    }),
    new vs.models.Query({
      'target': 'start',
      'test': vs.models.Query.Test['LESS_THAN'],
      'testArgs': end
    }),
    new vs.models.Query({
      'target': 'end',
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

  // Make sure we don't have any repeating queries
  query = u.array.uniqueKey(query, function(q) { return q.toString(); });

  var rowQueries = u.fast.filter(query, function(q) {
    if (rowLabels.indexOf(q['target']) < 0) { return false; }
    if ((q['target'] == 'chr' && chrValidTests.indexOf(q['test']) < 0) || q['negate']) {
      throw new vs.models.ModelsException('The ' + q['test'] + ' operation is not yet supported for chromosomes; supported operations are: ' + JSON.stringify(chrValidTests));
    }
    if ((q['target'] == 'start' || q['target'] == 'end') && bpValidTests.indexOf(q['test']) < 0) {
      throw new vs.models.ModelsException('The ' + q['test'] + ' operation is not yet supported for start/end positions by the bigwig library; supported operations are: ' + JSON.stringify(bpValidTests));
    }
    if (q['target'] == 'start' && (q['test'] == '>=' || (q['test'] == '<' && q['negate']))) {
      throw new vs.models.ModelsException('The only supported test for "start" is "<"');
    }
    if (q['target'] == 'end' && (q['test'] == '<' || (q['test'] == '>=' && q['negate']))) {
      throw new vs.models.ModelsException('The only supported test for "end" is ">="');
    }
    return true;
  });

  var chrQueries = u.fast.filter(rowQueries, function(q) { return q['target'] == 'chr' && !q['negate']; });
  var startEndQueries = u.fast.filter(rowQueries, function(q) { return q['target'] == 'start' || q['target'] == 'end' });
  var greaterThanQueries = u.fast.filter(startEndQueries, function(q) { return q['test'] == '>=' || (q['negate'] && q['test'] == '<'); });
  var lessThanQueries = u.fast.filter(startEndQueries, function(q) { return q['test'] == '<' || (q['negate'] && q['test'] == '>='); });

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
    end: u.fast.filter(startEndQueries, function(q) { return q['target'] == 'start'; }).map(function(q) { return q['testArgs']; }).reduce(function(v1, v2) { return Math.min(v1, v2); }),
    start: u.fast.filter(startEndQueries, function(q) { return q['target'] == 'end'; }).map(function(q) { return q['testArgs']; }).reduce(function(v1, v2) { return Math.max(v1, v2); })
  };

  return new vs.models.GenomicRangeQuery(range.chr, range.start, range.end);
};
