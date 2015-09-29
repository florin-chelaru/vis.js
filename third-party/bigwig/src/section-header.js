/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 11:55 PM
 */

goog.provide('bigwig.SectionHeader');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.SectionHeader = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.SectionHeader, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
/*bigwig.SectionHeader.Fields = {
  chrId: 4,
  start: 4,
  end: 4,
  rest: 0
};*/

bigwig.SectionHeader.Fields = {
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
 * @returns {bigwig.SectionHeader}
 */
bigwig.SectionHeader.fromArrayBuffer = function(data, littleEndian) {
  return /** @type {bigwig.SectionHeader} */ (bigwig.BigwigStruct.fromArrayBuffer(bigwig.SectionHeader, bigwig.SectionHeader.Fields, data, littleEndian));
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.SectionHeader}
 */
bigwig.SectionHeader.fromDataView = function(view, littleEndian) {
  return /** @type {bigwig.SectionHeader} */ (bigwig.BigwigStruct.fromDataView(bigwig.SectionHeader, bigwig.SectionHeader.Fields, view, littleEndian));
};
