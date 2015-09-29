/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/25/2015
 * Time: 2:25 PM
 */

goog.provide('bigwig.models.RTreeHeader');

goog.require('bigwig.models.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.models.BigwigStruct}
 */
bigwig.models.RTreeHeader = function() {
  bigwig.models.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.models.RTreeHeader, bigwig.models.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.models.RTreeHeader.Fields = {
  magic: 4,
  blockSize: 4,
  itemCount: 8,
  startChromIx: 4, 
  startBase: 4,
  endChromIx: 4,
  endBase: 4,
  endFileOffset: 8,
  itemsPerSlot: 4,
  reserved: 4
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.models.RTreeHeader}
 */
bigwig.models.RTreeHeader.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.models.BigwigStruct.fromArrayBuffer(bigwig.models.RTreeHeader, bigwig.models.RTreeHeader.Fields, data, littleEndian);
};

