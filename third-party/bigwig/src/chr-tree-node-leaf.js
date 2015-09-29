/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 8:35 PM
 */

goog.provide('bigwig.ChrTreeNodeLeaf');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.ChrTreeNodeLeaf = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.ChrTreeNodeLeaf, bigwig.BigwigStruct);

/**
 * @param {ArrayBuffer} data
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNodeLeaf}
 */
bigwig.ChrTreeNodeLeaf.fromArrayBuffer = function(data, keySize, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNodeLeaf}
 */
bigwig.ChrTreeNodeLeaf.fromDataView = function(view, keySize, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, view, littleEndian);
};
