/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 8:35 PM
 */

goog.provide('vis.models.bigwig.ChrTreeNodeLeaf');

goog.require('vis.models.bigwig.BigwigBase');


/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.ChrTreeNodeLeaf = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.ChrTreeNodeLeaf, vis.models.bigwig.BigwigBase);

/**
 * @param {ArrayBuffer} data
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNodeLeaf}
 */
vis.models.bigwig.ChrTreeNodeLeaf.fromArrayBuffer = function(data, keySize, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNodeLeaf}
 */
vis.models.bigwig.ChrTreeNodeLeaf.fromDataView = function(view, keySize, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromDataView(vis.models.bigwig.ChrTreeNodeLeaf, {key: keySize, chrId: 4, chrSize: 4}, view, littleEndian);
};
