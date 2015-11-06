/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/9/2015
 * Time: 6:01 PM
 */

goog.provide('vs.models.Transformer');

goog.require('vs.models.Point');

/**
 * @param {function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point} transformation
 * @constructor
 */
vs.models.Transformer = function(transformation) {
  /**
   * @type {function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point}
   * @private
   */
  this._transformation = transformation;
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} point
 * @returns {vs.models.Point}
 */
vs.models.Transformer.prototype.calc = function(point) {
  return this._transformation.call(null, point);
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} point
 * @returns {Array.<number>}
 */
vs.models.Transformer.prototype.calcArr = function(point) {
  var t = this.calc(point);
  return [t['x'], t['y']];
};

/**
 * @param {number} x
 * @returns {number}
 */
vs.models.Transformer.prototype.calcX = function(x) {
  return this._transformation.call(null, {'x': x})['x'];
};

/**
 * @param {number} y
 * @returns {number}
 */
vs.models.Transformer.prototype.calcY = function(y) {
  return this._transformation({'y': y})['y'];
};

/**
 * @param {vs.models.Transformer|function((vs.models.Point|{x: (number|undefined), y: (number|undefined)})): vs.models.Point} transformer
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
    return transformer.call(null, self.calc(point));
  });
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} offset
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.translate = function(offset) {
  return this.combine(vs.models.Transformer.translate(offset));
};

/**
 * @param {function(number):number} xScale
 * @param {function(number):number} yScale
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.scale = function(xScale, yScale) {
  return this.combine(vs.models.Transformer.scale(xScale, yScale));
};

/**
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.prototype.intCoords = function() {
  return this.combine(vs.models.Transformer.intCoords());
};

/**
 * @param {vs.models.Point|{x: (number|undefined), y: (number|undefined)}} offset
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.translate = function(offset) {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(
      point['x'] != undefined ? point['x'] + offset['x'] : undefined,
      point['y'] != undefined ? point['y'] + offset['y'] : undefined);
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
      point['x'] != undefined ? xScale(point['x']) : undefined,
      point['y'] != undefined ? yScale(point['y']) : undefined);
  });
};

/**
 * @returns {vs.models.Transformer}
 */
vs.models.Transformer.intCoords = function() {
  return new vs.models.Transformer(function(point) {
    return new vs.models.Point(Math.floor(point['x']), Math.floor(point['y']));
  });
};
