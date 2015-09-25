/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 3:27 PM
 */

goog.provide('vis.models.bigwig.TotalSummary');

goog.require('vis.models.bigwig.BigwigBase');

/**
 * @constructor
 * @extends {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.TotalSummary = function() {
  vis.models.bigwig.BigwigBase.apply(this, arguments);
};

goog.inherits(vis.models.bigwig.TotalSummary, vis.models.bigwig.BigwigBase);

/**
 * @type {Object.<string, number>}
 */
vis.models.bigwig.TotalSummary.Fields = {
  basesCovered: 8,
  minVal: -8,
  maxVal: -8,
  sumData: -8,
  sumSquares: -8
};

/**
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.TotalSummary}
 */
vis.models.bigwig.TotalSummary.fromArrayBuffer = function(data, littleEndian) {
  return vis.models.bigwig.BigwigBase.fromArrayBuffer(vis.models.bigwig.TotalSummary, vis.models.bigwig.TotalSummary.Fields, data, littleEndian);
};
