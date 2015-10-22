/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 6:01 PM
 */

goog.provide('vs.models.Transformer');

goog.require('vs.models.Point');

/**
 * @param {function(vs.models.Point)} transformation
 * @constructor
 */
vs.models.Transformer = function(transformation) {
  /**
   * @type {function(vs.models.Point|{x: number=, y: number=}): vs.models.Point}
   * @private
   */
  this._transformation = transformation;
};

/**
 * @param {vs.models.Point|{x: number=, y: number=}} point
 * @returns {vs.models.Point}
 */
vs.models.Transformer.prototype.calc = function(point) {
  return this._transformation.call(null, point);
};

/**
 * @param {vs.models.Point|{x: number=, y: number=}} point
 * @returns {Array.<number>}
 */
vs.models.Transformer.prototype.calcArr = function(point) {
  var t = this.calc(point);
  return [t.x, t.y];
};

/**
 * @param {number} x
 * @returns {number}
 */
vs.models.Transformer.prototype.calcX = function(x) {
  return this._transformation.call(null, {x: x}).x;
};

/**
 * @param {number} y
 * @returns {number}
 */
vs.models.Transformer.prototype.calcY = function(y) {
  return this._transformation({y: y}).y;
};

/**
 * @param {vs.models.Transformer|function(vs.models.Point|{x: number=, y: number=}): vs.models.Point} transformer
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.combine = function(transformer) {
  var self = this;
  if (transformer instanceof vs.models.Transformer) {
    return new vs.models.Transformer(function (point) {
      return transformer.calc(self.calc(point));
    });
  }

  // function
  return new vs.models.Transformer(function (point) {
    return transformer(self.calc(point));
  });
};

/**
 * @param {vs.models.Point|{x: number=, y: number=}} offset
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.translate = function(offset) {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(
      point.x != undefined ? point.x + offset.x : undefined,
      point.y != undefined ? point.y + offset.y : undefined);
  });
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.scale = function(xScale, yScale) {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(
      point.x != undefined ? xScale(point.x) : undefined,
      point.y != undefined ? yScale(point.y) : undefined);
  });
};

/**
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.intCoords = function() {
  return new vs.models.Transformer(function(point) {
    return { x: Math.floor(point.x), y: Math.floor(point.y) };
  });
};
