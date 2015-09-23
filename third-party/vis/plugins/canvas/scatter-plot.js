/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vis.plugins.canvas.ScatterPlot');

goog.require('vis.ui.canvas.CanvasVisualization');
goog.require('vis.utils');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

goog.require('vis.ui.canvas');
goog.require('vis.models.Point');
goog.require('vis.models.Transformer');

goog.require('goog.async.Deferred');
goog.require('goog.array');

/**
 * @constructor
 * @extends vis.ui.canvas.CanvasVisualization
 */
vis.plugins.canvas.ScatterPlot = function() {
  vis.ui.canvas.CanvasVisualization.apply(this, arguments);
};

goog.inherits(vis.plugins.canvas.ScatterPlot, vis.ui.canvas.CanvasVisualization);

vis.plugins.canvas.ScatterPlot.prototype.preDraw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vis.plugins.canvas.ScatterPlot.prototype.draw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.draw.apply(this, arguments);

  var data = this.data;

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;
  var xCol = options.xCol;
  var yCol = options.yCol;

  var context = this.pendingCanvas[0].getContext('2d');

  var transform =
    vis.models.Transformer.scale(xScale, yScale)
      .combine(vis.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = goog.array.range(data.nrows).map(function(i) {
    return new vis.models.RowDataItemWrapper(data, i, options);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.vals[xCol], y: d.vals[yCol]});
    vis.ui.canvas.circle(context, point.x, point.y, 10, '#ff6520')
  });
};
