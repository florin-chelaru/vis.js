/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 12:19 PM
 */

goog.provide('vs.plugins.canvas.ManhattanPlot');

goog.require('vs.plugins.canvas.ManhattanPlotOptions');
goog.require('vs.ui.canvas.CanvasVis');
goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

goog.require('goog.array');

/**
 * @constructor
 * @extends vs.ui.canvas.CanvasVis
 */
vs.plugins.canvas.ManhattanPlot = function() {
  vs.ui.canvas.CanvasVis.apply(this, arguments);
};

goog.inherits(vs.plugins.canvas.ManhattanPlot, vs.ui.canvas.CanvasVis);

vs.plugins.canvas.ManhattanPlot.prototype.beginDraw = function() {
  vs.ui.canvas.CanvasVis.prototype.beginDraw.apply(this, arguments);
};

/**
 * @override
 */
vs.plugins.canvas.ManhattanPlot.prototype.draw = function() {
  vs.ui.canvas.CanvasVis.prototype.draw.apply(this, arguments);

  /** @type {vs.models.DataSource} */
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
    vs.models.Transformer.scale(xScale, yScale)
      .combine(vs.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = goog.array.range(data.nrows).map(function(i) {
    return new vs.models.RowDataItemWrapper(data, i, options);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.row(options.rowsOrderBy), y: d.vals[cols[0]]});
    vs.ui.canvas.circle(context, point.x, point.y, 3, '#1e60d4')
  });
};

