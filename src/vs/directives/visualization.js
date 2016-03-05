/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:37 PM
 */

goog.provide('vs.directives.Visualization');

goog.require('vs.ui.VisualizationFactory');
goog.require('vs.ui.VisHandler');
goog.require('vs.async.TaskService');
goog.require('vs.linking.LinkProvider');

/**
 * @param {angular.Scope} $scope
 * @param {vs.ui.VisualizationFactory} visualizationFactory
 * @param {vs.async.TaskService} taskService
 * @param {angular.Scope} $rootScope
 * @param {vs.linking.LinkProvider} linkProvider
 * @constructor
 * @extends {ngu.Directive}
 */
vs.directives.Visualization = function($scope, visualizationFactory, taskService, $rootScope, linkProvider) {
  ngu.Directive.apply(this, arguments);

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
   * @type {angular.Scope}
   * @private
   */
  this._$rootScope = $rootScope;

  /**
   * @type {vs.linking.LinkProvider}
   * @private
   */
  this._linkProvider = linkProvider;

  /**
   * @type {vs.ui.VisualizationFactory}
   * @private
   */
  this._visualizationFactory = visualizationFactory;
};

goog.inherits(vs.directives.Visualization, ngu.Directive);


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
  'taskService': { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._taskService; })},
  'handler': { get: /** @type {function (this:vs.directives.Visualization)} */ (function() { return this._handler; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Visualization.prototype.link = {
  'pre': function($scope, $element, $attrs, controller) {
    this._handler = this._visualizationFactory.createNew($scope, $element, $attrs);
    $element.css({
      'top': (this._handler['options']['y'] || 0) + 'px',
      'left': (this._handler['options']['x'] || 0) + 'px',
      'width': this._handler['options']['width'] + 'px',
      'height': this._handler['options']['height'] + 'px'
    });
  },

  'post': function($scope, $element, $attrs, controller) {
    var self = this;
    $element.on('resizeend', function(e) {
      self._handler['options']['width'] = e['width'];
      self._handler['options']['height'] = e['height'];
      self._handler.scheduleRedraw();
    });

    this['handler']['brushing'].addListener(function(e) {
      this._$rootScope.$broadcast('brushing', e);
    }, this);

    $scope.$on('brushing', function(e, brushingEvent) {
      /**
       * @type {Array.<vs.models.DataSource>}
       */
      var data = self['handler']['data'];
      var objects = self._linkProvider.brushingObjects(brushingEvent, data);

      self['handler'].brush(brushingEvent, objects);
    });
  }
};
