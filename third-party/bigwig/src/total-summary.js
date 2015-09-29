/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 3:27 PM
 */

goog.provide('bigwig.TotalSummary');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.TotalSummary = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.TotalSummary, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.TotalSummary.Fields = {
  basesCovered: 8,
  minVal: -8,
  maxVal: -8,
  sumData: -8,
  sumSquares: -8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.TotalSummary}
 */
bigwig.TotalSummary.fromArrayBuffer = function(data, littleEndian) {
  return /** @type {bigwig.TotalSummary} */ (bigwig.BigwigStruct.fromArrayBuffer(bigwig.TotalSummary, bigwig.TotalSummary.Fields, data, littleEndian));
};
