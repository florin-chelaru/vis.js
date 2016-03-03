/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 6:11 PM
 */

goog.provide('vs.models.Point');

/**
 * @param {number} [x]
 * @param {number} [y]
 * @constructor
 */
vs.models.Point = function(x, y) {
  /**
   * @type {number}
   */
  this['x'] = x;

  /**
   * @type {number}
   */
  this['y'] = y;
};

/**
 * @type {number}
 * @name vs.models.Point#x
 */
vs.models.Point.prototype.x;

/**
 * @type {number}
 * @name vs.models.Point#y
 */
vs.models.Point.prototype.y;
