/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 1:44 PM
 */

goog.provide('vis.ui.UiException');

goog.require('vis.Exception');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends vis.Exception
 */
vis.ui.UiException = function(message, innerException) {
  vis.Exception.apply(this, arguments);

  this.name = 'UiException';
};

goog.inherits(vis.ui.UiException, vis.Exception);

