/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:08 PM
 */

goog.provide('bigwig.ZoomHeader');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.ZoomHeader = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.ZoomHeader, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.ZoomHeader.Fields = {
  reductionLevel: 4,
  reserved: 4,
  dataOffset: 8,
  indexOffset: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ZoomHeader}
 */
bigwig.ZoomHeader.fromArrayBuffer = function(data, littleEndian) {
  return /** @type {bigwig.ZoomHeader} */ (bigwig.BigwigStruct.fromArrayBuffer(bigwig.ZoomHeader, bigwig.ZoomHeader.Fields, data, littleEndian));
};
