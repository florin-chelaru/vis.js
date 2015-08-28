/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 2:42 PM
 */

goog.provide('vis.models.RowDataItem');

/**
 * @interface
 */
vis.models.RowDataItem = function() {};

Object.defineProperties(vis.models.RowDataItem.prototype, {
  index: {
    /** @returns {number} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  data: {
    /** @returns {Array.<{label: string, d: *}>} */
    get: function() { throw new vis.AbstractMethodException(); }
  },
  vals: {
    /** @returns {Array.<number>} */
    get: function() { throw new vis.AbstractMethodException(); }
  }
});
