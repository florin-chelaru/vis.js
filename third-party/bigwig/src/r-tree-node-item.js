/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/25/2015
 * Time: 2:46 PM
 */

goog.provide('bigwig.RTreeNodeItem');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.RTreeNodeItem = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.RTreeNodeItem, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.RTreeNodeItem.Fields = {
  startChromIx: 4,
  startBase: 4,
  endChromIx: 4,
  endBase: 4,
  dataOffset: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNodeItem}
 */
bigwig.RTreeNodeItem.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.RTreeNodeItem, bigwig.RTreeNodeItem.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNodeItem}
 */
bigwig.RTreeNodeItem.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.RTreeNodeItem, bigwig.RTreeNodeItem.Fields, view, littleEndian);
};
