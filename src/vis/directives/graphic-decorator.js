/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vis.directives.GraphicDecorator');

goog.require('vis.directives.Visualization');
goog.require('vis.ui.Decorator');
goog.require('vis.ui.Visualization');

goog.require('vis.async.TaskService');

/**
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.GraphicDecorator = function() {
  vis.directives.Directive.apply(this, arguments);

  /**
   * @type {vis.ui.Decorator}
   * @private
   */
  this._decorator = null;
};

goog.inherits(vis.directives.GraphicDecorator, vis.directives.Directive);

Object.defineProperties(vis.directives.GraphicDecorator.prototype, {
  decorator: { get: function() { return this._decorator; }}
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vis.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  /** @type {vis.directives.Visualization} */
  var visualization = $scope.visualization.handler;

  this._decorator = this.createDecorator($scope, $element, $attrs, visualization.taskService, $element.parent(), visualization.vis);

  visualization.taskService.chain(this._decorator.drawTask, visualization.vis.drawTask);
  visualization.taskService.chain(visualization.vis.preDrawTask, this._decorator.preDrawTask);
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vis.async.TaskService} taskService
 * @param {jQuery} $targetElement
 * @param {vis.ui.Visualization} target
 * @returns {vis.ui.Decorator}
 */
vis.directives.GraphicDecorator.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) { throw new vis.AbstractMethodException(); };
