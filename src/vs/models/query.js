/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 4:50 PM
 */

goog.provide('vs.models.Query');

/**
 * @param {({target: (vs.models.Query.Target|string), targetLabel: string, test: (vs.models.Query.Test|string), testArgs: *, negate: (boolean|undefined)}|vs.models.Query)} opts
 * @constructor
 */
vs.models.Query = function(opts) {
  /**
   * @type {vs.models.Query.Target}
   */
  this.target = opts.target;

  /**
   * @type {string}
   */
  this.targetLabel = opts.targetLabel;

  /**
   * @type {vs.models.Query.Test}
   */
  this.test = opts.test;

  /**
   * @type {*}
   */
  this.testArgs = opts.testArgs;

  /**
   * @type {boolean}
   */
  this.negate = !!opts.negate;
};

/**
 * @returns {string}
 */
vs.models.Query.prototype.toString = function() {
  var argsStr = (this.testArgs === undefined) ? 'undefined' : JSON.stringify(this.testArgs);
  var ret =
      this.target + '.' +
      this.targetLabel + ' ' +
      this.test + ' ' +
      argsStr;
  return this.negate ? 'not(' + ret + ')' : ret;
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
  ROWS: 'rows',
  COLS: 'cols',
  VALS: 'vals'
};

/**
 * @enum {string}
 */
vs.models.Query.Test = {
  EQUALS: '==',
  GREATER_THAN: '>',
  LESS_THAN: '<',
  GREATER_OR_EQUALS: '>=',
  LESS_OR_EQUALS: '<=',
  CONTAINS: 'contains',
  IN: 'in'
};
