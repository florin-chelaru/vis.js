/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 12:19 PM
 */

goog.provide('vs.plugins.svg.ManhattanPlot');

goog.require('vs.plugins.svg.ManhattanPlotOptions');
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
vs.plugins.svg.ManhattanPlot = function() {
  vs.ui.svg.SvgVisualization.apply(this, arguments);
};

goog.inherits(vs.plugins.svg.ManhattanPlot, vs.ui.svg.SvgVisualization);

vs.plugins.svg.ManhattanPlot.prototype.preDraw = function() {
  vs.ui.svg.SvgVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vs.plugins.svg.ManhattanPlot.prototype.draw = function() {
  vs.ui.svg.SvgVisualization.prototype.draw.apply(this, arguments);

  /** @type {vs.models.DataSource} */
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
    return new vs.models.RowDataItemWrapper(data, i, options);
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

