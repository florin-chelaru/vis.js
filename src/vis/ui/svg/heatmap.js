/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vis.ui.svg.Heatmap');

goog.require('vis.ui.Visualization');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vis.ui.Visualization
 */
vis.ui.svg.Heatmap = function(scope, element, attrs) {
  vis.ui.Visualization.call(this, scope, element, attrs);
};

goog.inherits(vis.ui.svg.Heatmap, vis.ui.Visualization);
