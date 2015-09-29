/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 8:31 PM
 */

goog.provide('bigwig.ChrTreeNodeItem');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.ChrTreeNodeItem = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.ChrTreeNodeItem, bigwig.BigwigStruct);

/**
 * @param {ArrayBuffer} data
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNodeItem}
 */
bigwig.ChrTreeNodeItem.fromArrayBuffer = function(data, keySize, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.ChrTreeNodeItem, {key: keySize, childOffset: 8}, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNodeItem}
 */
bigwig.ChrTreeNodeItem.fromDataView = function(view, keySize, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.ChrTreeNodeItem, {key: keySize, childOffset: 8}, view, littleEndian);
};
