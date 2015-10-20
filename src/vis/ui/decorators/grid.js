/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 1:18 PM
 */

goog.provide('vis.ui.decorators.Grid');

goog.require('vis.ui.Decorator');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.decorators.Grid = function($scope, $element, $attrs,  taskService, $targetElement, target) {
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
};

goog.inherits(vis.ui.decorators.Grid, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.decorators.Grid.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.decorators.Grid.prototype, {
  type: {
    get: function() { return this._type; }
  },

  ticks: {
    get: function () { return this._ticks || 10; }
  }
});

vis.ui.decorators.Grid.prototype.draw = function() {
  vis.ui.Decorator.prototype.draw.apply(this, arguments);
};
