/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/28/2015
 * Time: 4:54 PM
 */

goog.provide('bigwig.Record');

/**
 * @interface
 */
bigwig.Record = function() {};

Object.defineProperties(bigwig.Record.prototype, {
  /**
   * @type {number}
   * @instance
   * @memberof bigwig.Record
   */
  value: { get: function() { return null; } }
});
