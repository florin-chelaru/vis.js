/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 11:55 PM
 */

goog.provide('vis.models.bigwig.DataRecord');

goog.require('vis.models.bigwig.BigwigBase');


/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.DataRecord = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.DataRecord, vis.models.bigwig.BigwigBase);

/**
 * @type {Object.<string, number>}
 */
/*vis.models.bigwig.DataRecord.Fields = {
  chrId: 4,
  start: 4,
  end: 4,
  rest: 0
};*/

vis.models.bigwig.DataRecord.Fields = {
  chrId: 4,
  start: 4,
  end: 4,
  itemStep: 4,
  itemSpan: 4,
  type: 1,
  reseved: 1,
  itemCount: 2
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.DataRecord}
 */
vis.models.bigwig.DataRecord.fromArrayBuffer = function(data, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.DataRecord, vis.models.bigwig.DataRecord.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.DataRecord}
 */
vis.models.bigwig.DataRecord.fromDataView = function(view, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromDataView(vis.models.bigwig.DataRecord, vis.models.bigwig.DataRecord.Fields, view, littleEndian);
};
