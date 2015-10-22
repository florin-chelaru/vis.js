/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/3/2015
 * Time: 9:03 AM
 */

goog.provide('vs.directives.GraphicDecorator');

goog.require('vs.directives.Visualization');
goog.require('vs.ui.Decorator');
goog.require('vs.ui.Visualization');

goog.require('vs.async.TaskService');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.GraphicDecorator = function() {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.ui.Decorator}
   * @private
   */
  this._decorator = null;
};

goog.inherits(vs.directives.GraphicDecorator, vs.directives.Directive);

Object.defineProperties(vs.directives.GraphicDecorator.prototype, {
  decorator: { get: function() { return this._decorator; }}
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.GraphicDecorator.prototype.link = function($scope, $element, $attrs, controller) {
  /** @type {vs.directives.Visualization} */
  var visualization = $scope.visualization.handler;

  this._decorator = this.createDecorator($scope, $element, $attrs, visualization.taskService, $element.parent(), visualization.vs);

  visualization.taskService.chain(this._decorator.drawTask, visualization.vs.drawTask);
  visualization.taskService.chain(visualization.vs.preDrawTask, this._decorator.preDrawTask);
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vs.async.TaskService} taskService
 * @param {jQuery} $targetElement
 * @param {vs.ui.Visualization} target
 * @returns {vs.ui.Decorator}
 */
vs.directives.GraphicDecorator.prototype.createDecorator = function($scope, $element, $attrs, taskService, $targetElement, target) { throw new vs.AbstractMethodException(); };
