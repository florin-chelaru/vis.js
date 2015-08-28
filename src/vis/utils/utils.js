/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 11:30 AM
 */

goog.provide('vis.utils');

/**
 * Generates an array of consecutive numbers starting from startIndex
 * (or 0 if it's not defined)
 * @param {number} length
 * @param {number} [startIndex]
 */
vis.utils.range = function(length, startIndex) {
  startIndex = startIndex || 0;
  length = length || 0;

  var result = new Array(length);
  for (var i = 0; i < length; ++i) {
    result[i] = i + startIndex;
  }

  return result;
};
