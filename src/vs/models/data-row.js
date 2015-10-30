/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/28/2015
 * Time: 3:52 PM
 */

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
  index: { get: /** @type {function (this:vs.models.DataRow)} */ (function() { return this._index; })},
  data: { get: /** @type {function (this:vs.models.DataRow)} */ (function() { return this._data; })}
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
  var vals = valsLabel ? this.data.getVals(valsLabel) : this.data.vals[0];

  var index = (typeof colIndexOrLabel == 'number') ? colIndexOrLabel : this.data.colIndex(colIndexOrLabel);

  return vals.d[index * this.data.nrows + this.index];
};

/**
 * @param label
 * @returns {*}
 */
vs.models.DataRow.prototype.info = function(label) {
  var arr = this.data.getRow(label);
  if (!arr) { return undefined; }
  return arr.d[this.index];
};
