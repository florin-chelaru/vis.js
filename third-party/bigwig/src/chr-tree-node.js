/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 4:15 PM
 */

goog.provide('bigwig.ChrTreeNode');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.ChrTreeNode = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.ChrTreeNode, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.ChrTreeNode.Fields = {
  isLeaf: 1,
  reseved: 1,
  count: 2
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNode}
 */
bigwig.ChrTreeNode.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.ChrTreeNode, bigwig.ChrTreeNode.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.ChrTreeNode}
 */
bigwig.ChrTreeNode.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.ChrTreeNode, bigwig.ChrTreeNode.Fields, view, littleEndian);
};
