/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 1/6/2016
 * Time: 10:05 AM
 */

goog.provide('vs.linking.Key');

/**
 * @interface
 */
vs.linking.Key = function() {};

/**
 * @param {vs.linking.Key} k
 * @returns {boolean}
 */
vs.linking.Key.prototype.matches = function(k) {};
