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
  /*vis.directives.Directive.call(this, {
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
  });*/
  var self = this;
  vis.directives.Directive.call(this, {
    restrict: 'A', transclude: true, replace: false,
    controller: ['$scope', function($scope) {
      Object.defineProperties(this, {
        data: { get: function() { return self._data; } },
        visOptions: { get: function() { return self._options; } },
        visHandler: { get: function() { return self._handler; } },
        taskService: { get: function() { return self._taskService; } }
      });
    }]
  });

  /**
   * @type {vis.ui.VisualizationOptions}
   * @private
   */
  this._options = null;

  /**
   * @type {vis.models.DataSource}
   * @private
   */
  this._data = null;

  /**
   * @type {vis.ui.Visualization}
   * @private
   */
  this._handler = null;

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

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @override
 */
vis.directives.Visualization.prototype.link = {
  pre: function($scope, $element, $attrs, controller) {
    var self = this;

    this._options = this._visualizationFactory.generateOptions($scope, $element, $attrs, controller);
    this._data = this._options.data;
    this._handler = this._visualizationFactory.createNew($scope, $element, $attrs, controller);

    //$scope.options = $scope.visualizationFactory.generateOptions($scope, $element, $attrs);
    //$scope.handler = $scope.visualizationFactory.createNew($scope, $element, $attrs);

    $element.addClass('visualization');
    /*$element.css({
      width: $scope.options.width + 'px',
      height: $scope.options.height + 'px'
    });*/
    $element.css({
      width: this._options.width + 'px',
      height: this._options.height + 'px'
    });

    //$scope.handler.doDraw();
    this._handler.doDraw();
  },
  post: function($scope, $element, $attrs, controller) {
    var self = this;
    $scope.$watch(function(){ return self._options.dirty; }, function(newValue, oldValue) {
      self._handler.doDraw();
    });

    $element.resize(function(event) {
      self._options.width = event.width;
      self._options.height = event.height;
      self._handler.doDraw();
    });

    self._handler.doDraw();

    /*$scope.$watch(function(){ return $scope.options.dirty; }, function(newValue, oldValue) {
      $scope.handler.doDraw();
    });*/

    /*$element.resize(function(event) {
      $scope.options.width = event.width;
      $scope.options.height = event.height;
      $scope.handler.doDraw();
    });

    $scope.handler.doDraw();*/
  }
};
