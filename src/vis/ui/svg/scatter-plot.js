/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vis.ui.svg.ScatterPlot');

goog.require('vis.ui.svg.SvgVisualization');
goog.require('vis.utils');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vis.ui.svg.SvgVisualization
 */
vis.ui.svg.ScatterPlot = function(scope, element, attrs) {
  vis.ui.svg.SvgVisualization.call(this, scope, element, attrs);
};

goog.inherits(vis.ui.svg.ScatterPlot, vis.ui.svg.SvgVisualization);

vis.ui.svg.ScatterPlot.prototype.preDraw = function() {
  vis.ui.svg.SvgVisualization.prototype.preDraw.apply(this, arguments);
};

/**
 * @override
 */
vis.ui.svg.ScatterPlot.prototype.draw = function() {
  vis.ui.svg.SvgVisualization.prototype.draw.apply(this, arguments);

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

  var svg = d3.select(this.element[0]).select('svg');

  var viewport = svg.select('.viewport');
  if (viewport.empty()) {
    viewport = svg.append('g')
      .attr('class', 'viewport');
  }
  viewport
    .attr('transform', 'translate(' + margins.left + ', ' + margins.top + ')');

  var items = vis.utils.range(data.nrows).map(function(i) {
    return new vis.models.RowDataItemWrapper(data, i);
  });
  var selection = viewport.selectAll('circle').data(items);

  selection.enter()
    .append('circle');

  selection
    .attr('r', 10)
    .attr('cx', function(d) { return xScale(d.vals[0]); })
    .attr('cy', function(d) { return yScale(d.vals[1]); })
    .attr('fill', '#ff6520');

  selection.exit()
    .remove();
};
