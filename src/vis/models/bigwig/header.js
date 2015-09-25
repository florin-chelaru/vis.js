/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 10:36 AM
 */

goog.provide('vis.models.bigwig.Header');

goog.require('vis.models.bigwig.BigwigBase');


/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.Header = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.Header, vis.models.bigwig.BigwigBase);

Object.defineProperties(vis.models.bigwig.Header.prototype, {
  bigEndian: { get: function() { return this.magic == 0x888FFC26; } },
  littleEndian: { get: function() { return !this.bigEndian; } }
});

/**
 * @type {Object.<string, number>}
 */
vis.models.bigwig.Header.Fields = {
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
 * @returns {vis.models.bigwig.Header}
 */
vis.models.bigwig.Header.fromArrayBuffer = function(data) {
  var view = new DataView(data);

  var magic = view.getUint32(0);
  var bigEndian = magic == 0x888FFC26;

  var header = vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.Header, data, !bigEndian);
  header.magic = magic;

  return header;
};
