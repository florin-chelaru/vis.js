/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 1:10 PM
 */

goog.provide('bigwig.reflection.ReflectionException');

goog.require('bigwig.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends bigwig.Exception
 */
bigwig.reflection.ReflectionException = function(message, innerException) {
  bigwig.Exception.apply(this, arguments);

  this.name = 'ReflectionException';
};

goog.inherits(bigwig.reflection.ReflectionException, bigwig.Exception);
