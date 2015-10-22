/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:37 PM
 */

goog.provide('vs.directives.Visualization');

goog.require('vs.directives.Directive');
goog.require('vs.ui.VisualizationFactory');
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
   * @type {vs.ui.Visualization}
   * @private
   */
  this._vis = null;

  /**
   * @type {vs.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vs.ui.VisualizationFactory}
   * @private
   */
  this._visualizationFactory = visualizationFactory;
};

goog.inherits(vs.directives.Visualization, vs.directives.Directive);

Object.defineProperties(vs.directives.Visualization.prototype, {
  taskService: { get: function() { return this._taskService; } },
  vs: { get: function() { return this._vis; } }
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @override
 */
vs.directives.Visualization.prototype.link = {
  pre: function($scope, $element, $attrs, controller) {
    this._vis = this._visualizationFactory.createNew($scope, $element, $attrs, this._taskService);
    $element.addClass('visualization');
    $element.css({
      width: this._vis.options.width + 'px',
      height: this._vis.options.height + 'px'
    });
    this._vis.doDraw();
  },
  post: function($scope, $element, $attrs, controller) {
    var self = this;
    $scope.$watch(function(){ return self._vis.options.dirty; }, function(newValue, oldValue) {
      self._vis.doDraw();
    });

    $element.resize(function(event) {
      self._vis.options.width = event.width;
      self._vis.options.height = event.height;
      self._vis.doDraw();
    });

    self._vis.doDraw();
  }
};
