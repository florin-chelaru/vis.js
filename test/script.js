/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:11 AM
 */

goog.require('vis');

goog.require('vis.ui.webgl.ScatterPlot');
goog.require('vis.ui.svg.ScatterPlot');
goog.require('vis.ui.svg.ScatterPlotOptions');
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

main.controller('MyController', ['$scope', '$interval', function($scope, $interval) {
  $scope.data = {
    dirty: true,
    nrows: 4,
    ncols: 2,
    rows: [
      { label: 'name', d: ['florin','suze','wouter','apos'] },
      { label: 'id', d: [1,2,3,4] },
      { label: 'age', d: [30,24,35,22] },
      { label: 'sex', d: ['m','f','m','m'] }
    ],
    cols: [
      { label: 'name', d: ['gene1','gene2'] },
      { label: 'id', d: [1,2] },
      { label: 'start', d: [10,12] },
      { label: 'end', d: [15,16] },
      { label: 'chr', d: [1,1] }
    ],
    vals: {
      label: 'gene expression',
      d: [0.67, 0.309, 0.737, 0.688, 0.011, 0.303, 0.937, 0.06],
      boundaries: { min: 0, max: 1 }
    }
  };
  $scope.options = {
    boundaries: {
    },
    width: 500,
    height: 500
  };
  /*$interval(function() {
   $scope.data = {
   dirty: ($scope.data.name + ' other').length >= 100,
   name: $scope.data.name + ' other',
   address: $scope.data.address + ' other'
   }
   }, 1000);*/
}]);
