/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 8:31 PM
 */

goog.provide('vis.models.bigwig.ChrTreeNodeItem');

goog.require('vis.models.bigwig.BigwigBase');


/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.ChrTreeNodeItem = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.ChrTreeNodeItem, vis.models.bigwig.BigwigBase);

/**
 * @param {ArrayBuffer} data
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNodeItem}
 */
vis.models.bigwig.ChrTreeNodeItem.fromArrayBuffer = function(data, keySize, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.ChrTreeNodeItem, {key: keySize, childOffset: 8}, data, littleEndian);
};

/**
 * @param {DataView} view
 * @param {number} keySize
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeNodeItem}
 */
vis.models.bigwig.ChrTreeNodeItem.fromArrayBuffer = function(view, keySize, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromDataView(vis.models.bigwig.ChrTreeNodeItem, {key: keySize, childOffset: 8}, view, littleEndian);
};
