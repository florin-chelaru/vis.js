/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 9:42 AM
 */

goog.provide('vis.ui.VisualizationFactory');

goog.require('vis.Configuration');
goog.require('vis.ui.Visualization');
goog.require('vis.ui.UiException');
goog.require('vis.models.DataSource');
goog.require('vis.models.DataSourceWrapper');
goog.require('vis.async.TaskService');

goog.require('vis.reflection');


/**
 * @param {vis.Configuration} config
 * @constructor
 */
vis.ui.VisualizationFactory = function(config) {
  /**
   * visualization alias -> rendering type -> fully qualified type
   * @type {Object.<string, Object.<string, string>>}
   * @private
   */
  this._visMap = config.options['visualizations'];
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param {vis.async.TaskService} taskService
 * @returns {vis.ui.Visualization}
 */
vis.ui.VisualizationFactory.prototype.new = function($scope, $element, $attrs, taskService) {
  var options = this.generateOptions($scope, $element, $attrs);
  return vis.reflection.applyConstructor(options.visCtor, [$scope, $element, $attrs, taskService, options]);

  /*var renders = this._visMap[options.type];
  if (!renders) {
    throw new vis.ui.UiException('Undefined visualization type: ' + options.type + '. Did you forget to register it in the configuration?');
  }

  var typeStr;
  if (!$attrs.render) {
    if (angular.isObject(renders)) {
      var defaultRender = renders['default'];

      if (!defaultRender) {
        throw new vis.ui.UiException('Default renderer not defined for visualization ' + options.type + '.')
      }

      typeStr = renders[defaultRender];
      if (!typeStr) {
        throw new vis.ui.UiException('Default renderer ' + defaultRender + ' does not exist in the list of renderers for ' + options.type + '.');
      }
    } else {
      typeStr = renders;
    }
  } else {
    if (angular.isObject(renders)) {
      typeStr = renders[$attrs.render];
      if (!typeStr) {
        throw new vis.ui.UiException('Renderer ' + $attrs.render + ' does not exist in the list of renderers for ' + options.type + '.');
      }
    } else {
      throw new vis.ui.UiException('Renderer ' + $attrs.render + ' is not defined for ' + options.type + '.');
    }
  }

  var ctor = vis.reflection.evaluateFullyQualifiedTypeName(typeStr);
  var ret = vis.reflection.applyConstructor(ctor, [$scope, $element, $attrs, taskService, options]);

  if (!(ret instanceof vis.ui.Visualization)) {
    throw new vis.ui.UiException(typeStr + ' is not an instance of vis.ui.Visualization.');
  }

  return ret;*/
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @returns {vis.ui.VisualizationOptions}
 */
vis.ui.VisualizationFactory.prototype.generateOptions = function($scope, $element, $attrs) {
  var opt = ($attrs.options != undefined) ? $scope.$eval($attrs.options) : {};

  var type = opt.type || $attrs.type;
  if (!type) { throw new vis.ui.UiException('Expected option: type'); }

  var renders = this._visMap[type];
  if (!renders) {
    throw new vis.ui.UiException('Undefined visualization type: ' + type + '. Did you forget to register it in the configuration?');
  }

  var render = opt.render || $attrs.render;
  var typeStr;
  if (!render) {
    if (angular.isObject(renders)) {
      var defaultRender = renders['default'];

      if (!defaultRender) {
        throw new vis.ui.UiException('Default renderer not defined for visualization ' + type + '.')
      }

      typeStr = renders[defaultRender];
      if (!typeStr) {
        throw new vis.ui.UiException('Default renderer ' + defaultRender + ' does not exist in the list of renderers for ' + type + '.');
      }
    } else {
      typeStr = renders;
    }
  } else {
    if (angular.isObject(renders)) {
      typeStr = renders[render];
      if (!typeStr) {
        throw new vis.ui.UiException('Renderer ' + render + ' does not exist in the list of renderers for ' + type + '.');
      }
    } else {
      throw new vis.ui.UiException('Renderer ' + render + ' is not defined for ' + type + '.');
    }
  }

  var inputData = opt.inputData || $attrs.inputData;
  if (!inputData) {
    throw new vis.ui.UiException('No data specified for visualization. (' + type + ', ' + render + ')');
  }

  inputData = $scope.$eval(inputData);
  if (!(inputData instanceof vis.models.DataSource)) {
    inputData = new vis.models.DataSourceWrapper(inputData);
  }

  var axisBoundaries;
  if (opt.axisBoundaries) {
    axisBoundaries = opt.axisBoundaries;
  } else if ($attrs.axisBoundaries) {
    axisBoundaries = $scope.$eval($attrs.axisBoundaries);
  }

  var width;
  if (opt.width) { width = opt.width; }
  else if ($attrs.width) { width = parseInt($attrs.width); }

  var height;
  if (opt.height) { height = opt.height; }
  else if ($attrs.height) { height = parseInt($attrs.height); }

  var margins;
  if (opt.margins) {
    margins = opt.margins;
  } else if ($attrs.margins) {
    margins = $scope.$eval($attrs.margins);
  }

  var x = opt.x || $attrs.x;
  var y = opt.y || $attrs.y;

  var vals = opt.vals || $attrs.vals;

  opt.type = type;
  opt.render = render;
  opt.inputData = inputData;
  opt.axisBoundaries = axisBoundaries;
  opt.width = width;
  opt.height = height;
  opt.margins = margins;
  opt.x = x;
  opt.y = y;
  opt.vals = vals;

  opt.visCtor = vis.reflection.evaluateFullyQualifiedTypeName(typeStr);

  typeStr += 'Options';
  var ctor;
  try {
    ctor = vis.reflection.evaluateFullyQualifiedTypeName(typeStr);
  } catch (ex) {
    // No customized options defined for this visualization. We will use the standard ones.
    ctor = vis.ui.VisualizationOptions;
  }

  opt.visOptionsCtor = ctor;

  var ret = vis.reflection.applyConstructor(ctor, [opt, inputData]);

  if (!(ret instanceof vis.ui.VisualizationOptions)) {
    throw new vis.ui.UiException(typeStr + ' is not an instance of vis.ui.VisualizationOptions.');
  }

  return ret;
};
