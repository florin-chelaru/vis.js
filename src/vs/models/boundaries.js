/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 12:35 PM
 */

goog.provide('vs.models.Boundaries');

/**
 * @param {number} [min]
 * @param {number} [max]
 * @constructor
 */
vs.models.Boundaries = function(min, max) {
  /**
   * @type {number}
   */
  this.min = min;

  /**
   * @type {number}
   */
  this.max = max;
};
