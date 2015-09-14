/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/30/2015
 * Time: 9:14 AM
 */

goog.provide('vis.directives.Visualization');

goog.require('vis.directives.Directive');
goog.require('vis.ui.VisualizationFactory');
goog.require('vis.async.TaskService');

/**
 * @param {vis.ui.VisualizationFactory} visualizationFactory
 * @param {vis.async.TaskService} taskService
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Visualization = function(visualizationFactory, taskService) {
  vis.directives.Directive.call(this, {
    restrict: 'A',
    scope: {
      _options: '=options',

      data: '=inputData'
    },
    controller: ['$scope', function($scope) {
      $scope.taskService = taskService;
      $scope.visualizationFactory = visualizationFactory;
      $scope.options = null;
      $scope.handler = null;

      Object.defineProperties(this, {
        options: { get: function() { return $scope.options; } },
        data: { get: function() { return $scope.data; } },
        handler: { get: function() { return $scope.handler; } },
        taskService: { get: function() { return $scope.taskService; } }
      });
    }]
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

    $element.addClass('visualization');
    $element.css({
      width: $scope.options.width + 'px',
      height: $scope.options.height + 'px'
    });
  },
  post: function($scope, $element, $attrs) {
    $scope.$watch(function(){ return $scope.options.dirty; }, function(newValue, oldValue) {
      $scope.handler.doDraw();
    });

    $element.resize(function(event) {
      $scope.options.width = event.width;
      $scope.options.height = event.height;
      $scope.handler.doDraw();
    });

    $scope.handler.doDraw();
  }
};
