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
   * @type {vis.ui.VisualizationOptions}
   * @private
   */
  //this._options = null;

  /**
   * @type {vis.models.DataSource}
   * @private
   */
  //this._data = null;

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
  //data: { get: function() { return this._data; } },
  //options: { get: function() { return this._options; } },
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
    var self = this;

    //this._options = this._visualizationFactory.generateOptions($scope, $element, $attrs);
    //this._data = this._options.data;
    this._vis = this._visualizationFactory.new($scope, $element, $attrs, this._taskService);

    //$scope.options = $scope.visualizationFactory.generateOptions($scope, $element, $attrs);
    //$scope.handler = $scope.visualizationFactory.createNew($scope, $element, $attrs);

    $element.addClass('visualization');
    /*$element.css({
     width: $scope.options.width + 'px',
     height: $scope.options.height + 'px'
     });*/
    $element.css({
      width: this._vis.options.width + 'px',
      height: this._vis.options.height + 'px'
    });

    //$scope.handler.doDraw();
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
      //self._vis.doDraw();
    });

    self._vis.doDraw();

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
