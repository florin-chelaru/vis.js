/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 1:10 PM
 */

goog.provide('vis.reflection.ReflectionException');

goog.require('vis.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends vis.Exception
 */
vis.reflection.ReflectionException = function(message, innerException) {
  vis.Exception.apply(this, arguments);

  this.name = 'ReflectionException';
};

goog.inherits(vis.reflection.ReflectionException, vis.Exception);
