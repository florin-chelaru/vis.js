/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vis.directives.GraphicDecorator');

goog.require('vis.directives.Visualization');
goog.require('vis.ui.Decorator');

/**
 * @param [$scope]
 * @param {function} [controller]
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.GraphicDecorator = function($scope, controller) {
  var self = this;
  vis.directives.Directive.call(this, {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: $scope,
    controller: ['$scope', function($scope) {
      $scope.self = self;

      if (controller) { controller($scope); }
    }]
  });
};

goog.inherits(vis.directives.GraphicDecorator, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  var self = $scope.self;
  Object.defineProperties($scope, {
    data: { get: function() { return controller.data; } },
    targetOptions: { get: function() { return controller.options; } },
    visualizationHandler: { get: function() { return controller.handler; } },
    taskService: { get: function() { return controller.taskService; } }
  });
  $scope.handler = self.createHandler($scope, $element, $attrs, $element.parent());

  controller.taskService.chain($scope.handler.drawTask, $scope.visualizationHandler.drawTask);
  controller.taskService.chain($scope.visualizationHandler.preDrawTask, $scope.handler.preDrawTask);
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @returns {vis.ui.Decorator}
 */
vis.directives.GraphicDecorator.prototype.createHandler = function($scope, $element, $attrs, $targetElement) { throw new vis.AbstractMethodException(); };
