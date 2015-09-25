/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 3:52 PM
 */

goog.provide('vis.models.bigwig.ChrTreeHeader');

goog.require('vis.models.bigwig.BigwigBase');

/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.ChrTreeHeader = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.ChrTreeHeader, vis.models.bigwig.BigwigBase);

/**
 * @type {Object.<string, number>}
 */
vis.models.bigwig.ChrTreeHeader.Fields = {
  magic: 4,
  blockSize: 4,
  keySize: 4,
  valSize: 4,
  itemCount: 8,
  reserved: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ChrTreeHeader}
 */
vis.models.bigwig.ChrTreeHeader.fromArrayBuffer = function(data, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.ChrTreeHeader, data, littleEndian);
};

