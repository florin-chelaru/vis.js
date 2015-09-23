/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/4/2015
 * Time: 1:12 PM
 */

goog.provide('vis.ui.svg.SvgVisualization');

goog.require('vis.ui.Visualization');
goog.require('vis.utils');

goog.require('vis.models.DataSource');
goog.require('vis.models.RowDataItemWrapper');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

/**
 * @constructor
 * @extends vis.ui.Visualization
 */
vis.ui.svg.SvgVisualization = function () {
  vis.ui.Visualization.apply(this, arguments);
};

goog.inherits(vis.ui.svg.SvgVisualization, vis.ui.Visualization);

vis.ui.svg.SvgVisualization.prototype.preDraw = function () {
  vis.ui.Visualization.prototype.preDraw.apply(this, arguments);

  if (d3.select(this.element[0]).select('svg').empty()) {
    d3.select(this.element[0])
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('rect')
      .style('fill', '#ffffff')
      .attr('width', '100%')
      .attr('height', '100%');
  }
};
