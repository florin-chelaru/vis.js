/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 12:19 PM
 */

goog.provide('vis.plugins.canvas.ManhattanPlot');

goog.require('vis.plugins.canvas.ManhattanPlotOptions');
goog.require('vis.ui.canvas.CanvasVisualization');
goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

goog.require('goog.array');

/**
 * @constructor
 * @extends vis.ui.canvas.CanvasVisualization
 */
vis.plugins.canvas.ManhattanPlot = function() {
  vis.ui.canvas.CanvasVisualization.apply(this, arguments);
};

goog.inherits(vis.plugins.canvas.ManhattanPlot, vis.ui.canvas.CanvasVisualization);

vis.plugins.canvas.ManhattanPlot.prototype.preDraw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vis.plugins.canvas.ManhattanPlot.prototype.draw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.draw.apply(this, arguments);

  /** @type {vis.models.DataSource} */
  var data = this.data;

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;
  var cols = options.colsFilter;

  var context = this.pendingCanvas[0].getContext('2d');

  var transform =
    vis.models.Transformer.scale(xScale, yScale)
      .combine(vis.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = goog.array.range(data.nrows).map(function(i) {
    return new vis.models.RowDataItemWrapper(data, i, options);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.row(options.rowsOrderBy), y: d.vals[cols[0]]});
    vis.ui.canvas.circle(context, point.x, point.y, 3, '#1e60d4')
  });
};

