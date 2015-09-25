/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:34 PM
 */

goog.provide('vis.models.bigwig.BigwigBase');

goog.require('goog.math.Long');

/**
 * @param {Object.<string, *>} fields
 * @constructor
 */
vis.models.bigwig.BigwigBase = function(fields) {
  var self = this;
  var args = arguments;
  var fields = this.constructor.Fields;
  if (args.length == 1) {
    $.each(args[0], function(field, value) {
      self[field] = value;
    });
  } else {
    var i = 0;
    $.each(fields, function(field) {
      self[field] = args[i];
      ++i;
    });
  }
};

/**
 * @returns {string}
 */
vis.models.bigwig.BigwigBase.prototype.toString = function() {
  return JSON.stringify(this, function(k, v) {
    if (v instanceof goog.math.Long) {
      if (v.getHighBits() == 0) { return v.getLowBitsUnsigned(); }
      return v.toString();
    }
    return v;
  });
};

/**
 * @param {function(new: vis.models.bigwig.BigwigBase)} bigwigType
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.BigwigBase.fromArrayBuffer = function(bigwigType, data, littleEndian) {
  var bigEndian = !littleEndian;
  var fields = bigwigType.Fields;
  var view = new DataView(data);

  var ret = {};
  var offset = 0;
  $.each(fields, function(field, size) {
    var val;
    switch (size) {
      case 8:
        var first = view.getUint32(offset, !bigEndian);
        var second = view.getUint32(offset + 4, !bigEndian);
        val = bigEndian ? new goog.math.Long(second, first) : new goog.math.Long(first, second);
        break;
      case 4:
        val = view.getUint32(offset, !bigEndian);
        break;
      case 2:
        val = view.getUint16(offset, !bigEndian);
        break;
      case 1:
        val = view.getUint8(offset, !bigEndian);
        break;
      case -8:
        val = view.getFloat64(offset, !bigEndian);
        break;
      case -4:
        val = view.getFloat32(offset, !bigEndian);
        break;
    }
    offset += Math.abs(size);
    ret[field] = val;
  });

  return vis.reflection.applyConstructor(bigwigType, [ret]);
};

/**
 * @param {function(new: vis.models.bigwig.BigwigBase)} bigwigType
 * @returns {number}
 */
vis.models.bigwig.BigwigBase.sizeOf = function(bigwigType) {
  var ret = 0;
  var fields = bigwigType.Fields;
  $.each(fields, function(field, size) {
    ret += Math.abs(size);
  });
  return ret;
};


