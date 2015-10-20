/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/24/2015
 * Time: 2:13 PM
 */

goog.provide('vis.models.ModelsException');

/**
 * @param {string} message
 * @param {Error} [innerException]
 * @constructor
 * @extends u.Exception
 */
vis.models.ModelsException = function(message, innerException) {
  u.Exception.apply(this, arguments);

  this.name = 'ModelsException';
};

goog.inherits(vis.models.ModelsException, u.Exception);
