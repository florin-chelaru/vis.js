/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 6:11 PM
 */

goog.provide('vis.models.Point');

/**
 * @param {number} [x]
 * @param {number} [y]
 * @constructor
 */
vis.models.Point = function(x, y) {
  /**
   * @type {number}
   */
  this.x = x || 0;

  /**
   * @type {number}
   */
  this.y = y || 0;
};
