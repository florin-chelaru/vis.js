/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 3:52 PM
 */

goog.provide('bigwig.ChrTreeHeader');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.ChrTreeHeader = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.ChrTreeHeader, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.ChrTreeHeader.Fields = {
  magic: 4,
  blockSize: 4,
  keySize: 4,
  valSize: 4,
  itemCount: 8,
  reserved: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeHeader}
 */
bigwig.ChrTreeHeader.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.ChrTreeHeader, bigwig.ChrTreeHeader.Fields, data, littleEndian);
};

