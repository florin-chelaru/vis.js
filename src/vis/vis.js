/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/26/2015
 * Time: 3:54 PM
 */

goog.provide('vis');

goog.require('vis.Configuration');
goog.require('vis.ui.VisualizationFactory');
goog.require('vis.ui.Visualization');

vis.main = angular.module('vis', []);

vis.main
  .provider('configuration', function() {
    var self = this;
    self.__proto__ = new vis.Configuration();
    self.$get = function() { return self; };
  });

vis.main
  .factory('visualizationFactory', ['configuration', function(configuration) {
    return new vis.ui.VisualizationFactory(configuration);
  }]);

vis.main
  .directive('visualization', ['visualizationFactory', function(visualizationFactory) {
    return {
      restrict: 'E',
      templateUrl: 'res/templates/visualization.html',
      scope: {
        data: '=inputData'
      },
      link: function(scope, element, attrs) {
        scope.handler = visualizationFactory.createNew(scope, element, attrs);

        scope.$watch(function(){return scope.data.dirty;}, function(newValue, oldValue) {
          if (newValue) {
            scope.handler.draw(scope.data);
            scope.data.dirty = false;
          }
        });
        /*scope.$watch(function(){return scope.data;}, function(newValue, oldValue) {
          // SO basically, here we update the visualization
          console.log(JSON.stringify(oldValue));
        });*/
        /*
        Same thing:
         scope.$watch('data', function(newValue, oldValue) {
         console.log(JSON.stringify(newValue));
         });
         */
      }
    };
  }]);

vis.main
  .factory('$exceptionHandler', function() {
  return function(exception, cause) {
    console.error(exception, cause);
    //throw exception;
  };
});

vis.main
  .controller('MyController', ['$scope', '$interval', function($scope, $interval) {
    $scope.data = {
      dirty: false,
      name: 'Naomi',
      address: '1600 Amphitheatre'
    };
    $interval(function() {
      $scope.data = {
        dirty: ($scope.data.name + ' other').length >= 100,
        name: $scope.data.name + ' other',
        address: $scope.data.address + ' other'
      }
    }, 1000);
  }]);
