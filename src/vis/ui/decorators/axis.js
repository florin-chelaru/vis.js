/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:17 PM
 */

goog.provide('vis.ui.decorators.Axis');

goog.require('vis.ui.Decorator');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.decorators.Axis = function($scope, $element, $attrs, taskService, $targetElement, target) {
  vis.ui.Decorator.apply(this, arguments);

  /**
   * @type {string}
   * @private
   */
  this._type = $attrs.type;

  /**
   * @type {number}
   * @private
   */
  this._ticks = ($attrs.ticks == undefined) ? 10 : parseInt($attrs.ticks);

  /**
   * @type {string}
   * @private
   */
  this._format = $attrs.format;
};

goog.inherits(vis.ui.decorators.Axis, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.decorators.Axis.Orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.decorators.Axis.prototype, {
  type: {
    get: function() { return this._type; }
  },

  ticks: {
    get: function () { return this._ticks || 10; }
  },

  format: {
    get: function() { return this._format; }
  }
});

vis.ui.decorators.Axis.prototype.draw = function() {
  vis.ui.Decorator.prototype.draw.apply(this, arguments);
};
