/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vis.directives.GraphicDecorator');

goog.require('vis.directives.Visualization');
goog.require('vis.ui.Decorator');

/**
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.GraphicDecorator = function() {
  var self = this;
  vis.directives.Directive.call(this, {
    require: '^visualization',
    restrict: 'E',
    transclude: true,
    controller: ['$scope', function($scope) {
      Object.defineProperties(this, {
        decoratorHandler: { get: function() { return this._decoratorHandler; }}
      });
    }]
  });

  /**
   * @type {vis.ui.Decorator}
   * @private
   */
  this._decoratorHandler = null;
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
  /*Object.defineProperties($scope, {
    data: { get: function() { return controller.data; } },
    targetOptions: { get: function() { return controller.options; } },
    visHandler: { get: function() { return controller.handler; } },
    taskService: { get: function() { return controller.taskService; } }
  });*/
  this._decoratorHandler = this.createHandler($scope, $element, $attrs, $element.parent());

  controller.taskService.chain(this._decoratorHandler.drawTask, controller.visHandler.drawTask);
  controller.taskService.chain(controller.visHandler.preDrawTask, this._decoratorHandler.preDrawTask);
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param $targetElement
 * @returns {vis.ui.Decorator}
 */
vis.directives.GraphicDecorator.prototype.createHandler = function($scope, $element, $attrs, $targetElement) { throw new vis.AbstractMethodException(); };
