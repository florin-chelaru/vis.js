/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 4:53 PM
 */

goog.provide('vs.Configuration');

/**
 * @constructor
 */
vs.Configuration = function() {

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = {};
};

/**
 * @type {Object.<string, *>}
 * @name vs.Configuration#options
 */
vs.Configuration.prototype.options;

Object.defineProperties(vs.Configuration.prototype, {
  options: { get: /** @type {function (this:vs.Configuration)} */ (function () { return this._options; })}
});

/**
 * @param {Object.<string, *>} options
 */
vs.Configuration.prototype.customize = function(options) {
  u.extend(this._options, options);
};
