/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vis.directives.GraphicDecorator');

goog.require('vis.directives.Visualization');
goog.require('vis.ui.decorators.Decorator');

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
    controller: function($scope) {
      $scope.self = self;

      if (controller) { controller($scope); }
    }
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
    targetOptions: { get: function() { return controller.options; } }
  });
  $scope.handler = self.createHandler($scope, $element, $attrs, $element.parent());

  $scope.$watch(function(){ return $scope.targetOptions.dirty; }, function(newValue, oldValue) {
    $scope.handler.draw();
  });

  $element.parent().resize(function(event) {
    $scope.handler.draw();
  });

  $scope.handler.draw();
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @returns {vis.ui.decorators.Decorator}
 */
vis.directives.GraphicDecorator.prototype.createHandler = function($scope, $element, $attrs, $targetElement) { throw new vis.AbstractMethodException(); };
