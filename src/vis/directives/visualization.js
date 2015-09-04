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
    restrict: 'A',
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

    $scope.handler.preDraw();
  },
  post: function($scope, $element, $attrs) {
    $scope.$watch(function(){ return $scope.options.dirty; }, function(newValue, oldValue) {
      $scope.handler.draw();
    });

    var boundingBox = $element[0].getBoundingClientRect();

    $element.resize(function(event) {
      /*var newBoundingBox = event.target.getBoundingClientRect();
      $scope.options.width -= newBoundingBox.width - boundingBox.width;
      $scope.options.height -= newBoundingBox.height - boundingBox.height;
      boundingBox = newBoundingBox;
      $scope.handler.draw();*/
      $scope.options.width -= event.dx;
      $scope.options.height -= event.dy;
      $scope.handler.draw();
    });

    $scope.handler.draw();
  }
};
