/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:08 AM
 */

goog.provide('vis.ui.Visualization');

goog.require('vis.models.DataSource');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 */
vis.ui.Visualization = function(scope, element, attrs) {
  /**
   * @private
   */
  this._scope = scope;

  /**
   * @private
   */
  this._element = element;

  /**
   * @private
   */
  this._attrs = attrs;
};

Object.defineProperties(vis.ui.Visualization.prototype, {
  scope: {
    get: function() { return this._scope; }
  },
  element: {
    get: function() { return this._element; }
  },
  attrs: {
    get: function() { return this._attrs; }
  },
  data: {
    /** @returns {vis.models.DataSource} */
    get: function() { return this._scope.data; }
  }
});

/**
 */
vis.ui.Visualization.prototype.draw = function() {};
