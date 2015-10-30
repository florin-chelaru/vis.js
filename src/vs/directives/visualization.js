/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:37 PM
 */

goog.provide('vs.directives.Visualization');

goog.require('vs.directives.Directive');
// TODO: Restore
//goog.require('vs.ui.VisualizationFactory');
goog.require('vs.async.TaskService');

/**
 * @param $scope
 * @param {vs.ui.VisualizationFactory} visualizationFactory
 * @param {vs.async.TaskService} taskService
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Visualization = function($scope, visualizationFactory, taskService) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {vs.ui.VisHandler}
   * @private
   */
  this._handler = null;

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vs.ui.VisualizationFactory}
   * @private
   */
  this._handlerualizationFactory = visualizationFactory;
};

goog.inherits(vs.directives.Visualization, vs.directives.Directive);


/**
 * @type {vs.async.TaskService}
 * @name vs.directives.Visualization#taskService
 */
vs.directives.Visualization.prototype.taskService;

/**
 * @type {vs.ui.VisHandler}
 * @name vs.directives.Visualization#handler
 */
vs.directives.Visualization.prototype.handler;

Object.defineProperties(vs.directives.Visualization.prototype, {
  taskService: { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._taskService; })},
  handler: { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._handler; })}
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @override
 */
vs.directives.Visualization.prototype.link = {
  pre: function($scope, $element, $attrs, controller) {
    this._handler = this._handlerualizationFactory.createNew($scope, $element, $attrs);
    $element.css({
      top: (this._handler.options.y || 0) + 'px',
      left: (this._handler.options.x || 0) + 'px',
      width: this._handler.options.width + 'px',
      height: this._handler.options.height + 'px'
    });
  },
  post: function($scope, $element, $attrs, controller) {
    var self = this;
    $element.resize(function(event) {
      self._handler.options.width = event.width;
      self._handler.options.height = event.height;
      if (!$scope.$$phase) { $scope.$apply(); }
    });
  }
};
