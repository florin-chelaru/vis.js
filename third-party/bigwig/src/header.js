/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 10:36 AM
 */

goog.provide('bigwig.Header');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.Header = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.Header, bigwig.BigwigStruct);

Object.defineProperties(bigwig.Header.prototype, {
  bigEndian: { get: function() { return this.magic == 0x888FFC26; } },
  littleEndian: { get: function() { return !this.bigEndian; } }
});

/**
 * @type {Object.<string, number>}
 */
bigwig.Header.Fields = {
  magic: 4,
  version: 2,
  zoomLevels: 2,
  chromosomeTreeOffset: 8,
  fullDataOffset: 8,
  fullIndexOffset: 8,
  fieldCount: 2,
  definedFieldCount: 2,
  autoSqlOffset: 8,
  totalSummaryOffset: 8,
  uncompressedBufSize: 4,
  reserved: 8
};

/**
 * @param {ArrayBuffer} data
 * @returns {bigwig.Header}
 */
bigwig.Header.fromArrayBuffer = function(data) {
  var view = new DataView(data);

  var magic = view.getUint32(0);
  var bigEndian = magic == 0x888FFC26;

  var header = bigwig.BigwigStruct.fromArrayBuffer(bigwig.Header, bigwig.Header.Fields, data, !bigEndian);
  header.magic = magic;

  return header;
};
