/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 1:44 PM
 */

goog.provide('vs.ui.UiException');

goog.require('u.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends u.Exception
 */
vs.ui.UiException = function(message, innerException) {
  u.Exception.apply(this, arguments);

  this.name = 'UiException';
};

goog.inherits(vs.ui.UiException, u.Exception);

