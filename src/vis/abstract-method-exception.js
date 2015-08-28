/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/28/2015
 * Time: 1:46 PM
 */

goog.provide('vis.AbstractMethodException');

goog.require('vis.Exception');

/**
 * @constructor
 * @extends vis.Exception
 */
vis.AbstractMethodException = function() {
  vis.Exception.call(this, 'Unimplemented abstract method.');

  this.name = 'AbstractMethodException';
};

goog.inherits(vis.AbstractMethodException, vis.Exception);

