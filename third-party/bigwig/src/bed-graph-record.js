/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/28/2015
 * Time: 4:25 PM
 */

goog.provide('bigwig.BedGraphRecord');

goog.require('bigwig.BigwigStruct');
goog.require('bigwig.Record');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 * @implements {bigwig.Record}
 */
bigwig.BedGraphRecord = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.BedGraphRecord, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.BedGraphRecord.Fields = {
  chromStart: 4,
  chromEnd: 4,
  value: -4
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.BedGraphRecord}
 */
bigwig.BedGraphRecord.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.BedGraphRecord, bigwig.BedGraphRecord.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.BedGraphRecord}
 */
bigwig.BedGraphRecord.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.BedGraphRecord, bigwig.BedGraphRecord.Fields, view, littleEndian);
};



