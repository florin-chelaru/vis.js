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
   * @type {function(vis.models.Point|{x: number=, y: number=}): vis.models.Point}
   * @private
   */
  this._transformation = transformation;
};

/**
 * @param {vis.models.Point|{x: number=, y: number=}} point
 * @returns {vis.models.Point}
 */
vis.models.Transformer.prototype.calc = function(point) {
  return this._transformation.call(null, point);
};

/**
 * @param {vis.models.Point|{x: number=, y: number=}} point
 * @returns {Array.<number>}
 */
vis.models.Transformer.prototype.calcArr = function(point) {
  var t = this.calc(point);
  return [t.x, t.y];
};

/**
 * @param {number} x
 * @returns {number}
 */
vis.models.Transformer.prototype.calcX = function(x) {
  return this._transformation.call(null, {x: x}).x;
};

/**
 * @param {number} y
 * @returns {number}
 */
vis.models.Transformer.prototype.calcY = function(y) {
  return this._transformation({y: y}).y;
};

/**
 * @param {vis.models.Transformer|function(vis.models.Point|{x: number=, y: number=}): vis.models.Point} transformer
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.prototype.combine = function(transformer) {
  var self = this;
  if (transformer instanceof vis.models.Transformer) {
    return new vis.models.Transformer(function (point) {
      return transformer.calc(self.calc(point));
    });
  }

  // function
  return new vis.models.Transformer(function (point) {
    return transformer(self.calc(point));
  });
};

/**
 * @param {vis.models.Point|{x: number=, y: number=}} offset
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.translate = function(offset) {
  return new vis.models.Transformer(function(point) {
    return new vis.models.Point(
      point.x != undefined ? point.x + offset.x : undefined,
      point.y != undefined ? point.y + offset.y : undefined);
  });
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.scale = function(xScale, yScale) {
  return new vis.models.Transformer(function(point) {
    return new vis.models.Point(
      point.x != undefined ? xScale(point.x) : undefined,
      point.y != undefined ? yScale(point.y) : undefined);
  });
};

/**
 * @returns {vis.models.Transformer}
 */
vis.models.Transformer.intCoords = function() {
  return new vis.models.Transformer(function(point) {
    return { x: Math.floor(point.x), y: Math.floor(point.y) };
  });
};
