/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/28/2015
 * Time: 5:05 PM
 */

goog.provide('bigwig.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends Error
 */
bigwig.Exception = function(message, innerException) {
  /**
   * @type {Error}
   * @private
   */
  this._errorCore = new Error(message);

  /**
   * @type {Error}
   * @private
   */
  this._innerException = innerException;

  /**
   * @type {string}
   */
  this.message = this._errorCore.message;

  /**
   * @type {string}
   */
  this.name = 'Exception';
};

goog.inherits(bigwig.Exception, Error);

Object.defineProperties(bigwig.Exception.prototype, {
  stack: {
    get: function() { return this._errorCore.stack; }
  },
  innerException: {
    /**
     * @returns {Error}
     */
    get: function() { return this._innerException; }
  }
});
