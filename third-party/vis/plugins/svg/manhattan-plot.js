/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 12:19 PM
 */

goog.provide('vis.plugins.svg.ManhattanPlot');

goog.require('vis.plugins.svg.ManhattanPlotOptions');
goog.require('vis.ui.svg.SvgVisualization');
goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

goog.require('goog.array');

/**
 * @constructor
 * @extends vis.ui.svg.SvgVisualization
 */
vis.plugins.svg.ManhattanPlot = function() {
  vis.ui.svg.SvgVisualization.apply(this, arguments);
};

goog.inherits(vis.plugins.svg.ManhattanPlot, vis.ui.svg.SvgVisualization);

vis.plugins.svg.ManhattanPlot.prototype.preDraw = function() {
  vis.ui.svg.SvgVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vis.plugins.svg.ManhattanPlot.prototype.draw = function() {
  vis.ui.svg.SvgVisualization.prototype.draw.apply(this, arguments);

  /** @type {vis.models.DataSource} */
  var data = this.data;

  // Nothing to draw
  if (!data.nrows) { return; }

  var options = this.options;

  var margins = options.margins;
  var xScale = options.scales.x;
  var yScale = options.scales.y;
  var cols = options.colsFilter;

  var svg = d3.select(this.element[0]).select('svg');

  var viewport = svg.select('.viewport');
  if (viewport.empty()) {
    viewport = svg.append('g')
      .attr('class', 'viewport');
  }
  viewport
    .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

  var items = goog.array.range(data.nrows).map(function(i) {
    return new vis.models.RowDataItemWrapper(data, i, options);
  });
  var selection = viewport.selectAll('circle').data(items);

  selection.enter()
    .append('circle');

  selection
    .attr('r', 3)
    .attr('cx', function(d) { return xScale(d.row(options.rowsOrderBy)); })
    .attr('cy', function(d) { return yScale(d.vals[cols[0]]); })
    .attr('fill', '#1e60d4');

  selection.exit()
    .remove();
};

