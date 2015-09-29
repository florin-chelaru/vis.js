/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:34 PM
 */

goog.provide('bigwig.BigwigStruct');

//goog.require('goog.math.Long');
goog.require('bigwig.Exception');
goog.require('bigwig.reflection');

/**
 * @param {Object.<string, *>} values
 * @constructor
 */
bigwig.BigwigStruct = function(values) {
  var self = this;
  $.each(values, function(field, value) {
    self[field] = value;
  });
};

/**
 * @returns {string}
 */
bigwig.BigwigStruct.prototype.toString = function() {
  return JSON.stringify(this, function(k, v) {
    if (v instanceof goog.math.Long) {
      if (v.getHighBits() == 0) { return v.getLowBitsUnsigned(); }
      return v.toString();
    }
    return v;
  });
};

/**
 * @param {function(new: bigwig.BigwigStruct)} bigwigType
 * @param {Object.<string, number>} fields
 * @param {ArrayBuffer} data
 * @param {boolean} [littleEndian]
 * @returns {bigwig.BigwigStruct}
 */
bigwig.BigwigStruct.fromArrayBuffer = function(bigwigType, fields, data, littleEndian) {
  var view = new DataView(data);
  return bigwig.BigwigStruct.fromDataView(bigwigType, fields, view, littleEndian);
};

/**
 * @param {function(new: bigwig.BigwigStruct)} bigwigType
 * @param {Object.<string, number>} fields
 * @param {DataView} view
 * @param {boolean} [littleEndian]
 * @returns {bigwig.BigwigStruct}
 */
bigwig.BigwigStruct.fromDataView = function(bigwigType, fields, view, littleEndian) {
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

  return bigwig.reflection.applyConstructor(bigwigType, [ret]);
};

/**
 * @param {function(new: bigwig.BigwigStruct)} bigwigType
 * @param {Object.<string, number>} [fields]
 * @returns {number}
 */
bigwig.BigwigStruct.sizeOf = function(bigwigType, fields) {
  var ret = 0;
  fields = fields || bigwigType.Fields;
  if (!fields) { throw new bigwig.Exception('Cannot compute size of type (fields not defined)'); }
  $.each(fields, function(field, size) {
    ret += Math.abs(size);
  });
  return ret;
};


