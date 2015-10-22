/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 2:02 PM
 */

goog.provide('vs.plugins.svg.ManhattanPlotOptions');

goog.require('vs.ui.TrackVisualizationOptions');

/**
 * @param options
 * @param {vs.models.DataSource} data
 * @constructor
 * @extends vs.ui.TrackVisualizationOptions
 */
vs.plugins.svg.ManhattanPlotOptions = function(options, data) {
  vs.ui.TrackVisualizationOptions.apply(this, arguments);
};

goog.inherits(vs.plugins.svg.ManhattanPlotOptions, vs.ui.TrackVisualizationOptions);
