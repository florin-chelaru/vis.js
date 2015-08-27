/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 1:39 PM
 */

goog.provide('vis.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends Error
 */
vis.Exception = function(message, innerException) {
  var tmp = new Error(message);

  /**
   * @type {string}
   */
  this.message = tmp.message;

  /**
   * @type {string}
   */
  this.name = 'Exception';

  Object.defineProperties(this, {
    stack: {
      /**
       * @returns {string}
       */
      get: function() { return tmp.stack; }
    },
    innerException: {
      /**
       * @returns {Error}
       */
      get: function() { return innerException; }
    }
  });
};

goog.inherits(vis.Exception, Error);
