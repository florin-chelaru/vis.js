/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:11 AM
 */

goog.require('vis');

goog.require('vis.ui.webgl.ScatterPlot');
goog.require('vis.ui.svg.ScatterPlot');
goog.require('vis.ui.canvas.ScatterPlot');
goog.require('vis.ui.svg.Heatmap');

var main = angular.module('main', ['vis']);

main.config(['configurationProvider', function(configuration) {
  configuration.customize({
    visualizations: {
      scatterplot: {
        webgl: 'vis.ui.webgl.ScatterPlot',
        canvas: 'vis.ui.canvas.ScatterPlot',
        svg: 'vis.ui.svg.ScatterPlot',
        default: 'svg'
      },
      heatmap: {
        svg: 'vis.ui.svg.Heatmap',
        default: 'svg'
      }
    }
  })
}]);

