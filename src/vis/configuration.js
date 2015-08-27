/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 4:53 PM
 */

goog.provide('vis.Configuration');

/**
 * @constructor
 */
vis.Configuration = function() {

  /**
   * @type {Object.<string, *>}
   * @private
   */
  this._options = {
  };

  var self = this;
  Object.defineProperty(this, 'options', {
    get: function () { return self._options; }
  });
};

/**
 * @param {Object.<string, *>} options
 */
vis.Configuration.prototype.customize = function(options) {
  angular.extend(this._options, options);
};
