/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:42 PM
 */

goog.provide('vs.models.RowDataItem');

/**
 * @interface
 */
vs.models.RowDataItem = function() {};

Object.defineProperties(vs.models.RowDataItem.prototype, {
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
