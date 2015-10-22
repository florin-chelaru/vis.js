/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:18 PM
 */

goog.provide('vs.ui.decorators.Grid');

goog.require('vs.ui.Decorator');

/**
 * @constructor
 * @extends vs.ui.Decorator
 */
vs.ui.decorators.Grid = function($scope, $element, $attrs,  taskService, $targetElement, target) {
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
};

goog.inherits(vs.ui.decorators.Grid, vs.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vs.ui.decorators.Grid.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vs.ui.decorators.Grid.prototype, {
  type: {
    get: function() { return this._type; }
  },

  ticks: {
    get: function () { return this._ticks || 10; }
  }
});

vs.ui.decorators.Grid.prototype.draw = function() {
  vs.ui.Decorator.prototype.draw.apply(this, arguments);
};
