/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 2:20 PM
 */

goog.provide('vs.ui.svg.Heatmap');

goog.require('vs.ui.Visualization');

/**
 * @param scope
 * @param element
 * @param attrs
 * @constructor
 * @extends vs.ui.Visualization
 */
vs.ui.svg.Heatmap = function(scope, element, attrs) {
  vs.ui.Visualization.call(this, scope, element, attrs);
};

goog.inherits(vs.ui.svg.Heatmap, vs.ui.Visualization);
