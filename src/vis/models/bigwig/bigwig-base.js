/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:34 PM
 */

goog.provide('vis.models.bigwig.BigwigBase');

goog.require('goog.math.Long');

/**
 * @param {Object.<string, *>} values
 * @constructor
 */
vis.models.bigwig.BigwigBase = function(values) {
  var self = this;
  $.each(values, function(field, value) {
    self[field] = value;
  });
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
 * @param {Object.<string, number>} fields
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.BigwigBase.fromArrayBuffer = function(bigwigType, fields, data, littleEndian) {
  var view = new DataView(data);
  return vis.models.bigwig.BigwigBase.fromDataView(bigwigType, fields, view, littleEndian);
};

/**
 * @param {function(new: vis.models.bigwig.BigwigBase)} bigwigType
 * @param {Object.<string, number>} fields
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {vis.models.bigwig.BigwigBase}
 */
vis.models.bigwig.BigwigBase.fromDataView = function(bigwigType, fields, view, littleEndian) {
  var bigEndian = !littleEndian;

  var ret = {};
  var offset = 0;
  var buf;
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
      case 0:
        // Zero-terminated string
        buf = [];
        for (; offset < view.byteLength && (buf.length == 0 || buf[buf.length-1] != 0); ++offset) {
          buf.push(view.getUint8(offset));
        }
        val = String.fromCharCode.apply(null, buf);
        break;
      default:
        buf = new Uint8Array(view.buffer, view.byteOffset + offset, size);
        var zeroIndex = buf.indexOf(0);
        if (zeroIndex >= 0) {
          buf = buf.subarray(0, zeroIndex);
        }
        val = String.fromCharCode.apply(null, buf);
        break;
    }
    offset += Math.abs(size);
    ret[field] = val;
  });

  return vis.reflection.applyConstructor(bigwigType, [ret]);
};

/**
 * @param {function(new: vis.models.bigwig.BigwigBase)} bigwigType
 * @param {Object.<string, number>} [fields]
 * @returns {number}
 */
vis.models.bigwig.BigwigBase.sizeOf = function(bigwigType, fields) {
  var ret = 0;
  fields = fields || bigwigType.Fields;
  if (!fields) { throw new vis.models.ModelsException('Cannot compute size of type (fields not defined)'); }
  $.each(fields, function(field, size) {
    ret += Math.abs(size);
  });
  return ret;
};


