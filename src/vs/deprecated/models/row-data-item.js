/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:42 PM
 */

goog.provide('vs.deprecated.models.RowDataItem');

/**
 * @interface
 */
vs.deprecated.models.RowDataItem = function() {};

Object.defineProperties(vs.deprecated.models.RowDataItem.prototype, {
  index: {
    /** @returns {number} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  data: {
    /** @returns {Array.<{label: string, d: *}>} */
    get: function() { throw new u.AbstractMethodException(); }
  },
  vals: {
    /** @returns {Array.<number>} */
    get: function() { throw new u.AbstractMethodException(); }
  }
});
