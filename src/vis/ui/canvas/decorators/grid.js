/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vis.ui.canvas.decorators.Grid');

goog.require('vis.ui.Decorator');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.Decorator
 */
vis.ui.canvas.decorators.Grid = function($scope, $element, $attrs, $targetElement) {
  vis.ui.Decorator.apply(this, [$scope, $element, $attrs, $targetElement]);

};

goog.inherits(vis.ui.canvas.decorators.Grid, vis.ui.Decorator);

/**
 * @type {{x: string, y: string}}
 */
vis.ui.canvas.decorators.Grid.orientation = {
  x: 'bottom',
  y: 'left'
};

Object.defineProperties(vis.ui.canvas.decorators.Grid.prototype, {
  type: {
    get: function() { return this.scope.type; }
  },

  ticks: {
    get: function () { return this.scope.ticks || 10; }
  }
});

vis.ui.canvas.decorators.Grid.prototype.draw = function() {
  var opts = this.targetOptions;
  if (!opts) { return; }

  var type = this.type;
  var margins = opts.margins;
  var intCoords = vis.models.Transformer.intCoords();
  var translate = vis.models.Transformer.translate({x: margins.left, y: margins.top}).combine(intCoords);

  var context = this.visualization.pendingCanvas[0].getContext('2d');
  var moveTo = context.__proto__.moveTo;
  var lineTo = context.__proto__.lineTo;

  var scale = opts.scales[type];

  context.strokeStyle = '#eeeeee';
  context.lineWidth = 1;

  var ticks = scale.ticks(this.ticks);

  // Draw ticks
  var x1 = type == 'x' ? scale : function() { return 0; };
  var x2 = type == 'x' ? scale : function() { return opts.width - opts.margins.left - opts.margins.right; };
  var y1 = type == 'y' ? scale : function() { return 0; };
  var y2 = type == 'y' ? scale : function() { return opts.height - opts.margins.top - opts.margins.bottom; };

  ticks.forEach(function(tick) {
    moveTo.apply(context, translate.calcArr({x: x1(tick), y: y1(tick)}));
    lineTo.apply(context, translate.calcArr({x: x2(tick), y: y2(tick)}));
  });

  context.stroke();
};

