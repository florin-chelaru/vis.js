/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 6:01 PM
 */

goog.provide('vis.models.Transformer');

goog.require('vis.models.Point');

/**
 * @param {function(vis.models.Point)} transformation
 * @constructor
 */
vis.models.Transformer = function(transformation) {
  /**
   * @type {function(vis.models.Point)}
   * @private
   */
  this._transformation = transformation;
};

/**
 * @param {vis.models.Point} point
 */
vis.models.Transformer.prototype.calc = function(point) {
  return this._transformation(point);
};

/**
 * @param {vis.models.Transformer} transformer
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.prototype.combine = function(transformer) {
  var self = this;
  return new vis.models.Transformer(function(point) {
    return transformer.calc(self.calc(point));
  })
};

/**
 * @param {vis.models.Point} offset
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.translate = function(offset) {
  return new vis.models.Transformer(function(point) {
    return new vis.models.Point(point.x + offset.x, point.y + offset.y);
  });
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.scale = function(xScale, yScale) {
  return new vis.models.Transformer(function(point) {
    return new vis.models.Point(xScale(point.x), yScale(point.y));
  });
};
