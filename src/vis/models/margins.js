/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:21 PM
 */

goog.provide('vis.models.Margins');

/**
 * @param {number} top
 * @param {number} left
 * @param {number} bottom
 * @param {number} right
 * @constructor
 */
vis.models.Margins = function(top, left, bottom, right) {
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

Object.defineProperties(vis.models.Margins.prototype, {
  top: { get: function() { return this._top; } },
  left: { get: function() { return this._left; } },
  bottom: { get: function() { return this._bottom; } },
  right: { get: function() { return this._right; } },
  x: { get: function() { return [this.left, this.right]; } },
  y: { get: function() { return [this.top, this.bottom]; } }
});

/**
 * @param {vis.models.Margins|{top: number, left: number, bottom: number, right: number}} offset
 */
vis.models.Margins.prototype.add = function(offset) {
  return new vis.models.Margins(
    this._top + offset.top,
    this._left + offset.left,
    this._bottom + offset.bottom,
    this._right + offset.right);
};

/**
 * @param {*} other
 * @returns {boolean}
 */
vis.models.Margins.prototype.equals = function(other) {
  return (!!other && this._top == other._top && this._left == other._left && this._bottom == other._bottom && this._right == other._right);
};
