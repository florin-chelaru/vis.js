/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/30/2015
 * Time: 9:14 AM
 */

goog.provide('vis.directives.Visualization');

goog.require('vis.directives.Directive');
goog.require('vis.ui.VisualizationFactory');

/**
 * @param {vis.ui.VisualizationFactory} visualizationFactory
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Visualization = function(visualizationFactory) {
  vis.directives.Directive.call(this, {
    restrict: 'E',
    scope: {
      _options: '=options',

      data: '=inputData'
    },
    controller: function($scope) {
      $scope.visualizationFactory = visualizationFactory;
      $scope.options = null;
      $scope.handler = null;

      Object.defineProperties(this, {
        options: { get: function() { return $scope.options; } },
        data: { get: function() { return $scope.data; } }
      });
    }
  });
};

goog.inherits(vis.directives.Visualization, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @override
 */
vis.directives.Visualization.prototype.link = {
  pre: function($scope, $element, $attrs) {
    $scope.options = $scope.visualizationFactory.generateOptions($scope, $element, $attrs);
    $scope.handler = $scope.visualizationFactory.createNew($scope, $element, $attrs);
  },
  post: function($scope, $element, $attrs) {
    $scope.$watch(function(){ return $scope.options.dirty; }, function(newValue, oldValue) {
      $scope.handler.draw();
    });

    $scope.handler.draw();
  }
};
