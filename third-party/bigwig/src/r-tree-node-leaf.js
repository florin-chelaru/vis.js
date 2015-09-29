/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/25/2015
 * Time: 2:47 PM
 */

goog.provide('bigwig.RTreeNodeLeaf');

goog.require('bigwig.BigwigStruct');


/**
 * @constructor
 * @extends {bigwig.BigwigStruct}
 */
bigwig.RTreeNodeLeaf = function() {
  bigwig.BigwigStruct.apply(this, arguments);
};

goog.inherits(bigwig.RTreeNodeLeaf, bigwig.BigwigStruct);

/**
 * @type {Object.<string, number>}
 */
bigwig.RTreeNodeLeaf.Fields = {
  startChromIx: 4,
  startBase: 4,
  endChromIx: 4,
  endBase: 4,
  dataOffset: 8,
  dataSize: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNodeLeaf}
 */
bigwig.RTreeNodeLeaf.fromArrayBuffer = function(data, littleEndian) {
  return bigwig.BigwigStruct.fromArrayBuffer(bigwig.RTreeNodeLeaf, bigwig.RTreeNodeLeaf.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.RTreeNodeLeaf}
 */
bigwig.RTreeNodeLeaf.fromDataView = function(view, littleEndian) {
  return bigwig.BigwigStruct.fromDataView(bigwig.RTreeNodeLeaf, bigwig.RTreeNodeLeaf.Fields, view, littleEndian);
};
