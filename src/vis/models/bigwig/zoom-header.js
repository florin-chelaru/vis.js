/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:08 PM
 */

goog.provide('vis.models.bigwig.ZoomHeader');

goog.require('vis.models.bigwig.BigwigBase');

/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.ZoomHeader = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.ZoomHeader, vis.models.bigwig.BigwigBase);

/**
 * @type {Object.<string, number>}
 */
vis.models.bigwig.ZoomHeader.Fields = {
  reductionLevel: 4,
  reserved: 4,
  dataOffset: 8,
  indexOffset: 8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.ZoomHeader}
 */
vis.models.bigwig.ZoomHeader.fromArrayBuffer = function(data, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.ZoomHeader, data, littleEndian);
};
