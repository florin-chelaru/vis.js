/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 9:42 AM
 */

goog.provide('vs.ui.VisualizationFactory');

goog.require('vs.Configuration');
goog.require('vs.ui.VisHandler');
goog.require('vs.ui.UiException');
goog.require('vs.models.DataSource');
goog.require('vs.async.TaskService');

goog.require('u.reflection');


/**
 * @param {vs.Configuration} config
 * @param {vs.async.TaskService} taskService
 * @constructor
 */
vs.ui.VisualizationFactory = function(config, taskService) {
  /**
   * visualization alias -> rendering type -> fully qualified type
   * @type {Object.<string, Object.<string, string>>}
   * @private
   */
  this._visMap = config.options['visualizations'];

  this._taskService = taskService;
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @returns {vs.ui.VisHandler}
 */
vs.ui.VisualizationFactory.prototype.createNew = function($scope, $element, $attrs) {
  if (!$attrs.vsContext) { throw new vs.ui.UiException('No visual context defined for visualization'); }
  var visualContext = $scope.$eval($attrs.vsContext);
  if (!visualContext) { throw new vs.ui.UiException('Undefined visual context reference: ' + $attrs.vsContext); }

  var type = visualContext.construct.type;
  var render = visualContext.construct.render;
  if (!this._visMap[type]) { throw new vs.ui.UiException('Undefined visualization type: ' + type + '. Did you forget to register it in the configuration?'); }
  if (!this._visMap[type][render]) {
    throw new vs.ui.UiException('Unsupported rendering for visualization type ' + type + ': ' + render + '. ' +
      'Supported are the following: ' + Object.keys(this._visMap[type]).join(', ') + '.');
  }

  var typeStr = this._visMap[type][render];
  var visCtor = u.reflection.evaluateFullyQualifiedTypeName(typeStr);

  if (!$attrs.vsData) { throw new vs.ui.UiException('Data source not defined for visualization: ' + type + '/' + render + '.'); }
  var data = $scope.$eval($attrs.vsData);
  if (!data) { throw new vs.ui.UiException('Undefined data reference for visualization: ' + type + '/' + render + '.'); }

  return u.reflection.applyConstructor(visCtor, [$scope, $element, $attrs, this._taskService, visualContext.options, data]);
};
