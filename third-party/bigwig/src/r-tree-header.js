/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/25/2015
 * Time: 2:25 PM
 */

goog.provide('bigwig.RTreeHeader');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.RTreeHeader = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.RTreeHeader, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.RTreeHeader.Fields = {
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
 * @returns {bigwig.RTreeHeader}
 */
bigwig.RTreeHeader.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.RTreeHeader, bigwig.RTreeHeader.Fields, data, littleEndian);
};

