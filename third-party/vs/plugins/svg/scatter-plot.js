/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vs.plugins.svg.ScatterPlot');

goog.require('vs.ui.svg.SvgVisualization');
goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

goog.require('goog.array');

/**
 * @constructor
 * @extends vs.ui.svg.SvgVisualization
 */
vs.plugins.svg.ScatterPlot = function() {
  vs.ui.svg.SvgVisualization.apply(this, arguments);
};

goog.inherits(vs.plugins.svg.ScatterPlot, vs.ui.svg.SvgVisualization);

vs.plugins.svg.ScatterPlot.prototype.beginDraw = function() {
  vs.ui.svg.SvgVisualization.prototype.beginDraw.apply(this, arguments);
};

/**
 * @override
 */
vs.plugins.svg.ScatterPlot.prototype.draw = function() {
  vs.ui.svg.SvgVisualization.prototype.draw.apply(this, arguments);

  /** @type {vs.models.DataSource} */
  var data = this.data;

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;
  var xCol = options.colsFilter[0];
  var yCol = options.colsFilter[1];

  var svg = d3.select(this.element[0]).select('svg');

  var viewport = svg.select('.viewport');
  if (viewport.empty()) {
    viewport = svg.append('g')
      .attr('class', 'viewport');
  }
  viewport
    .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

  var items = goog.array.range(data.nrows).map(function(i) {
    return new vs.models.RowDataItemWrapper(data, i, options);
  });
  var selection = viewport.selectAll('circle').data(items);

  selection.enter()
    .append('circle');

  selection
    .attr('r', 10)
    .attr('cx', function(d) { return xScale(d.vals[xCol]); })
    .attr('cy', function(d) { return yScale(d.vals[yCol]); })
    .attr('fill', '#ff6520');

  selection.exit()
    .remove();
};
