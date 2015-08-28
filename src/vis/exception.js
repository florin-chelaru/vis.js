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

goog.inherits(vis.Exception, Error);

Object.defineProperties(vis.Exception.prototype, {
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
