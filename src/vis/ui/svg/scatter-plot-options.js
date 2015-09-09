/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 4:15 PM
 */

goog.provide('vis.ui.svg.ScatterPlotOptions');

goog.require('vis.ui.VisualizationOptions');

goog.require('vis.models.DataSource');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

/**
 * @param {{
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number= }} options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.VisualizationOptions
 */
vis.ui.svg.ScatterPlotOptions = function(options, data) {
  vis.ui.VisualizationOptions.apply(this, [options, data]);
};

goog.inherits(vis.ui.svg.ScatterPlotOptions, vis.ui.VisualizationOptions);
