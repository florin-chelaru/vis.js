/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vs.plugins.canvas.ScatterPlot');

goog.require('vs.ui.canvas.CanvasVisualization');

goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

goog.require('vs.ui.canvas');
goog.require('vs.models.Point');
goog.require('vs.models.Transformer');

goog.require('goog.async.Deferred');
goog.require('goog.array');

/**
 * @constructor
 * @extends vs.ui.canvas.CanvasVisualization
 */
vs.plugins.canvas.ScatterPlot = function() {
  vs.ui.canvas.CanvasVisualization.apply(this, arguments);
};

goog.inherits(vs.plugins.canvas.ScatterPlot, vs.ui.canvas.CanvasVisualization);

vs.plugins.canvas.ScatterPlot.prototype.preDraw = function() {
  vs.ui.canvas.CanvasVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vs.plugins.canvas.ScatterPlot.prototype.draw = function() {
  vs.ui.canvas.CanvasVisualization.prototype.draw.apply(this, arguments);

  var data = this.data;

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;
  var xCol = options.colsFilter[0];
  var yCol = options.colsFilter[1];

  var context = this.pendingCanvas[0].getContext('2d');

  var transform =
    vs.models.Transformer.scale(xScale, yScale)
      .combine(vs.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = goog.array.range(data.nrows).map(function(i) {
    return new vs.models.RowDataItemWrapper(data, i, options);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.vals[xCol], y: d.vals[yCol]});
    vs.ui.canvas.circle(context, point.x, point.y, 10, '#ff6520')
  });
};
