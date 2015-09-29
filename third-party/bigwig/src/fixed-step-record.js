/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/28/2015
 * Time: 4:25 PM
 */

goog.provide('bigwig.FixedStepRecord');

goog.require('bigwig.BigwigStruct');
goog.require('bigwig.Record');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 * @implements {bigwig.Record}
 */
bigwig.FixedStepRecord = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.FixedStepRecord, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.FixedStepRecord.Fields = {
  value: -4
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.FixedStepRecord}
 */
bigwig.FixedStepRecord.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.FixedStepRecord, bigwig.FixedStepRecord.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.FixedStepRecord}
 */
bigwig.FixedStepRecord.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.FixedStepRecord, bigwig.FixedStepRecord.Fields, view, littleEndian);
};



