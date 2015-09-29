/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/28/2015
 * Time: 4:25 PM
 */

goog.provide('bigwig.VariableStepRecord');

goog.require('bigwig.BigwigStruct');
goog.require('bigwig.Record');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 * @implements {bigwig.Record}
 */
bigwig.VariableStepRecord = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.VariableStepRecord, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.VariableStepRecord.Fields = {
  chromStart: 4,
  value: -4
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.VariableStepRecord}
 */
bigwig.VariableStepRecord.fromArrayBuffer = function(data, littleEndian) {
  return /** @type {bigwig.VariableStepRecord} */ (bigwig.BigwigStruct.fromArrayBuffer(bigwig.VariableStepRecord, bigwig.VariableStepRecord.Fields, data, littleEndian));
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.VariableStepRecord}
 */
bigwig.VariableStepRecord.fromDataView = function(view, littleEndian) {
  return /** @type {bigwig.VariableStepRecord} */ (bigwig.BigwigStruct.fromDataView(bigwig.VariableStepRecord, bigwig.VariableStepRecord.Fields, view, littleEndian));
};



