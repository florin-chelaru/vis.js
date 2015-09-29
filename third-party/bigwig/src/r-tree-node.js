/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/25/2015
 * Time: 2:42 PM
 */

goog.provide('bigwig.RTreeNode');

goog.require('bigwig.BigwigStruct');

/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.RTreeNode = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.RTreeNode, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.RTreeNode.Fields = {
  isLeaf: 1,
  reseved: 1,
  count: 2
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNode}
 */
bigwig.RTreeNode.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.RTreeNode, bigwig.RTreeNode.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNode}
 */
bigwig.RTreeNode.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.RTreeNode, bigwig.RTreeNode.Fields, view, littleEndian);
};

