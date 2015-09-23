/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:37 PM
 */

goog.provide('vis.directives.Visualization');

goog.require('vis.directives.Directive');
goog.require('vis.ui.VisualizationFactory');
goog.require('vis.async.TaskService');

/**
 * @param $scope
 * @param {vis.ui.VisualizationFactory} visualizationFactory
 * @param {vis.async.TaskService} taskService
 * @constructor
 * @extends {vis.directives.Directive}
 */
vis.directives.Visualization = function($scope, visualizationFactory, taskService) {
  vis.directives.Directive.apply(this, arguments);

  /**
   * @type {vis.ui.Visualization}
   * @private
   */
  this._vis = null;

  /**
   * @type {vis.async.TaskService}
   * @private
   */
  this._taskService = taskService;

  /**
   * @type {vis.ui.VisualizationFactory}
   * @private
   */
  this._visualizationFactory = visualizationFactory;
};

goog.inherits(vis.directives.Visualization, vis.directives.Directive);

Object.defineProperties(vis.directives.Visualization.prototype, {
  taskService: { get: function() { return this._taskService; } },
  vis: { get: function() { return this._vis; } }
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @override
 */
vis.directives.Visualization.prototype.link = {
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
