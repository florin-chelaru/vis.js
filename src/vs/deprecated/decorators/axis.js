/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:17 PM
 */

goog.provide('vs.ui.decorators.Axis');

goog.require('vs.ui.Decorator');
goog.require('vs.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Axis = function($scope, $element, $attrs, taskService, $targetElement, target, options) {
  vs.ui.Decorator.apply(this, arguments);

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

goog.inherits(vs.ui.decorators.Axis, vs.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vs.ui.decorators.Axis.Orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vs.ui.decorators.Axis.prototype, {
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

vs.ui.decorators.Axis.prototype.draw = function() {
  vs.ui.Decorator.prototype.draw.apply(this, arguments);
};
