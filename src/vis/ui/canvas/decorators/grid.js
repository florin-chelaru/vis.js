/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/11/2015
 * Time: 5:51 PM
 */

goog.provide('vis.ui.canvas.decorators.Grid');

goog.require('vis.ui.decorators.Grid');
goog.require('vis.ui.VisualizationOptions');

/**
 * @constructor
 * @extends vis.ui.decorators.Grid
 */
vis.ui.canvas.decorators.Grid = function() {
  vis.ui.decorators.Grid.apply(this, arguments);
};

goog.inherits(vis.ui.canvas.decorators.Grid, vis.ui.decorators.Grid);

vis.ui.canvas.decorators.Grid.prototype.draw = function() {
  vis.ui.decorators.Grid.prototype.draw.apply(this, arguments);
  var opts = this.visOptions;
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
