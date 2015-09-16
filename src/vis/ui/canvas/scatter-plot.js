/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vis.ui.canvas.ScatterPlot');

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

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vis.ui.canvas.CanvasVisualization
 */
vis.ui.canvas.ScatterPlot = function(scope, element, attrs) {
  vis.ui.canvas.CanvasVisualization.call(this, scope, element, attrs);
};

goog.inherits(vis.ui.canvas.ScatterPlot, vis.ui.canvas.CanvasVisualization);

vis.ui.canvas.ScatterPlot.prototype.preDraw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vis.ui.canvas.ScatterPlot.prototype.draw = function() {
  vis.ui.canvas.CanvasVisualization.prototype.draw.apply(this, arguments);

  var data = this.scope.data;
  if (data.ncols != 2) {
    throw new vis.ui.UiException('Scatter plot can only draw exactly two columns.')
  }

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;

  var context = this.pendingCanvas[0].getContext('2d');//this.element.find('canvas')[0].getContext('2d');

  var transform =
    vis.models.Transformer.scale(xScale, yScale)
      .combine(vis.models.Transformer.translate({x: margins.left, y: margins.top}));
  var items = vis.utils.range(data.nrows).map(function(i) {
    return new vis.models.RowDataItemWrapper(data, i);
  });

  items.forEach(function(d) {
    var point = transform.calc({x: d.vals[0], y: d.vals[1]});
    vis.ui.canvas.circle(context, point.x, point.y, 10, '#ff6520')
  });
};
