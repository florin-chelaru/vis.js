/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vis.ui.svg.ScatterPlot');

goog.require('vis.ui.Visualization');
goog.require('vis.utils');

goog.require('vis.models.RowDataItemWrapper');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vis.ui.Visualization
 */
vis.ui.svg.ScatterPlot = function(scope, element, attrs) {
  vis.ui.Visualization.call(this, scope, element, attrs);
};

goog.inherits(vis.ui.svg.ScatterPlot, vis.ui.Visualization);

/**
 * @override
 */
vis.ui.svg.ScatterPlot.prototype.draw = function() {
  vis.ui.Visualization.prototype.draw.apply(this, arguments);

  var data = this.data;
  if (data.ncols != 2) {
    throw new vis.ui.UiException('Scatter plot can only draw exactly two columns.')
  }

  // TODO
  var xScale = d3.scale.linear()
    .domain([0, 1])
    .range([0, this.attrs.width]);
  var yScale = d3.scale.linear()
    .domain([0, 1])
    .range([this.attrs.height, 0]);

  var svg = d3.select(this.element[0]).select('svg');
  if (svg.empty()) {
    svg = d3.select(this.element[0])
      .append('svg')
      .attr('width', this.attrs.width)
      .attr('height', this.attrs.height);
  }

  var items = vis.utils.range(data.nrows).map(function(i) { return new vis.models.RowDataItemWrapper(data, i); });
  var selection = svg.selectAll('circle').data(items);

  selection.enter()
    .append('circle')
    .attr('r', 10)
    .attr('cx', function(d) { return xScale(d.vals[0]); })
    .attr('cy', function(d) { return yScale(d.vals[1]); })
    .attr('fill', '#ff6520');

  selection.exit()
    .remove();
};
