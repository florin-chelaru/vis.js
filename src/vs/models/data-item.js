/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/27/2015
 * Time: 2:23 PM
 */

goog.provide('vs.models.DataItem');

/**
 * @interface
 */
vs.models.DataItem = function() {};

Object.defineProperties(vs.models.DataItem.prototype, {
  rowIdx: {
    /** @returns {number} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  colIdx: {
    /** @returns {number} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  row: {
    /** @returns {Array.<{label: string, d: *}>} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  col: {
    /** @returns {Array.<{label: string, d: *}>} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  val: {
    /** @returns {number} */
    get: function() { throw new u.AbstractMethodException(); }
  }
});

