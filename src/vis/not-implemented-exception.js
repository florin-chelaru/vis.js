/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:46 PM
 */

goog.provide('vis.NotImplementedException');

goog.require('vis.Exception');

/**
 * @constructor
 * @extends vis.Exception
 */
vis.NotImplementedException = function() {
  vis.Exception.call(this, 'The method has not been implemented.');

  this.name = 'NotImplementedException';
};

goog.inherits(vis.NotImplementedException, vis.Exception);

