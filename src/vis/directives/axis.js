/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vis.directives.Axis');

goog.require('vis.directives.Visualization');
goog.require('vis.ui.decorators.Axis');

/**
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Axis = function() {
  vis.directives.Directive.call(this, {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    scope: {
      type: '@',
      ticks: '@'
    },
    controller: function($scope) {
    }
  });
};

goog.inherits(vis.directives.Axis, vis.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.Axis.prototype.link = function($scope, $element, $attrs, controller) {
  Object.defineProperties($scope, {
    data: { get: function() { return controller.data; } },
    targetOptions: { get: function() { return controller.options; } }
  });
  $scope.handler = new vis.ui.decorators.Axis($scope, $element, $attrs, $element.parent());

  $scope.$watch(function(){ return $scope.targetOptions.dirty; }, function(newValue, oldValue) {
    $scope.handler.draw();
  });

  $scope.handler.draw();
};

