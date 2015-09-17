/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 10:11 AM
 */

var main = angular.module('main', ['vis']);

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
    axisBoundaries: {},
    width: 500,
    height: 500,
    margins: {
      left: 10,
      right: 10,
      bottom: 10,
      top: 10
    }
  };
}]);

/*

To register your own visualization, configure the library like in the example below:

main.config(['configurationProvider', function(configuration) {
  configuration.customize({
    visualizations: {
      scatterplot: {
        canvas: 'vis.ui.canvas.ScatterPlot',
        svg: 'vis.ui.svg.ScatterPlot',
        default: 'svg'
      }
    }
  })
}]);
*/
