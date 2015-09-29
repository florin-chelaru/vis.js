/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 8:35 PM
 */

goog.provide('bigwig.models.ChrTreeNodeLeaf');

goog.require('bigwig.models.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.models.BigwigStruct}
 */
bigwig.models.ChrTreeNodeLeaf = function() {
  bigwig.models.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.models.ChrTreeNodeLeaf, bigwig.models.BigwigStruct);

/**
 * @param {ArrayBuffer} data
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.models.ChrTreeNodeLeaf}
 */
bigwig.models.ChrTreeNodeLeaf.fromArrayBuffer = function(data, keySize, littleEndian) {
  return bigwig.models.BigwigStruct.fromArrayBuffer(bigwig.models.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {bigwig.models.ChrTreeNodeLeaf}
 */
bigwig.models.ChrTreeNodeLeaf.fromDataView = function(view, keySize, littleEndian) {
  return bigwig.models.BigwigStruct.fromDataView(bigwig.models.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, view, littleEndian);
};
