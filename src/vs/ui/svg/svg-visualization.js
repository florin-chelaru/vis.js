/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/4/2015
 * Time: 1:12 PM
 */

goog.provide('vs.ui.svg.SvgVisualization');

goog.require('vs.ui.Visualization');

goog.require('vs.models.DataSource');
goog.require('vs.models.RowDataItemWrapper');
goog.require('vs.models.Boundaries');
goog.require('vs.models.Margins');

/**
 * @constructor
 * @extends vs.ui.Visualization
 */
vs.ui.svg.SvgVisualization = function () {
  vs.ui.Visualization.apply(this, arguments);
};

goog.inherits(vs.ui.svg.SvgVisualization, vs.ui.Visualization);

vs.ui.svg.SvgVisualization.prototype.preDraw = function () {
  vs.ui.Visualization.prototype.preDraw.apply(this, arguments);

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
