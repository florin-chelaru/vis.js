/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:21 PM
 */

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
