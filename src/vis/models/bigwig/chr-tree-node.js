/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 4:15 PM
 */

goog.provide('vis.models.bigwig.ChrTreeNode');

goog.require('vis.models.bigwig.BigwigBase');

/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.ChrTreeNode = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.ChrTreeNode, vis.models.bigwig.BigwigBase);

/**
 * @type {Object.<string, number>}
 */
vis.models.bigwig.ChrTreeNode.Fields = {
  isLeaf: 1,
  reseved: 1,
  count: 2
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNode}
 */
vis.models.bigwig.ChrTreeNode.fromArrayBuffer = function(data, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.ChrTreeNode, vis.models.bigwig.ChrTreeNode.Fields, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNode}
 */
vis.models.bigwig.ChrTreeNode.fromDataView = function(view, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromDataView(vis.models.bigwig.ChrTreeNode, vis.models.bigwig.ChrTreeNode.Fields, view, littleEndian);
};
