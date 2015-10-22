/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 9:42 AM
 */

goog.provide('vs.ui.VisualizationFactory');

goog.require('vs.Configuration');
goog.require('vs.ui.Visualization');
goog.require('vs.ui.UiException');
goog.require('vs.models.DataSource');
goog.require('vs.models.DataSourceWrapper');
goog.require('vs.async.TaskService');

goog.require('u.reflection');


/**
 * @param {vs.Configuration} config
 * @constructor
 */
vs.ui.VisualizationFactory = function(config) {
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
 * @param {vs.async.TaskService} taskService
 * @returns {vs.ui.Visualization}
 */
vs.ui.VisualizationFactory.prototype.createNew = function($scope, $element, $attrs, taskService) {
  var options = this.generateOptions($scope, $element, $attrs);
  return u.reflection.applyConstructor(options.visCtor, [$scope, $element, $attrs, taskService, options]);
};

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @returns {vs.ui.VisualizationOptions}
 */
vs.ui.VisualizationFactory.prototype.generateOptions = function($scope, $element, $attrs) {
  var opt = ($attrs.options != undefined) ? $scope.$eval($attrs.options) : {};

  var type = opt.type || $attrs.type;
  if (!type) { throw new vs.ui.UiException('Expected option: type'); }

  var renders = this._visMap[type];
  if (!renders) {
    throw new vs.ui.UiException('Undefined visualization type: ' + type + '. Did you forget to register it in the configuration?');
  }

  var render = opt.render || $attrs.render;
  var typeStr;
  if (!render) {
    if (angular.isObject(renders)) {
      var defaultRender = renders['default'];

      if (!defaultRender) {
        throw new vs.ui.UiException('Default renderer not defined for visualization ' + type + '.')
      }

      typeStr = renders[defaultRender];
      if (!typeStr) {
        throw new vs.ui.UiException('Default renderer ' + defaultRender + ' does not exist in the list of renderers for ' + type + '.');
      }
    } else {
      typeStr = renders;
    }
  } else {
    if (angular.isObject(renders)) {
      typeStr = renders[render];
      if (!typeStr) {
        throw new vs.ui.UiException('Renderer ' + render + ' does not exist in the list of renderers for ' + type + '.');
      }
    } else {
      throw new vs.ui.UiException('Renderer ' + render + ' is not defined for ' + type + '.');
    }
  }

  var inputData = opt.inputData || $attrs.inputData;
  if (!inputData) {
    throw new vs.ui.UiException('No data specified for visualization. (' + type + ', ' + render + ')');
  }

  inputData = $scope.$eval(inputData);
  if (!(inputData instanceof vs.models.DataSource)) {
    inputData = new vs.models.DataSourceWrapper(inputData);
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

  // TODO: Separate using dynamic options convention
  var xCol = opt.xCol || $attrs.xCol;
  var yCol = opt.yCol || $attrs.yCol;

  var colsFilter;
  if (opt.colsFilter) {
    colsFilter = opt.colsFilter;
  } else if ($attrs.colsFilter) {
    colsFilter = $scope.$eval($attrs.colsFilter);
  }

  var colsLabel = opt.colsLabel || $attrs.colsLabel;
  var colsOrderBy = opt.colsOrderBy || $attrs.colsOrderBy;

  var rowsFilter;
  if (opt.rowsFilter) {
    rowsFilter = opt.rowsFilter;
  } else if ($attrs.rowsFilter) {
    rowsFilter = $scope.$eval($attrs.rowsFilter);
  }

  var rowsLabel = opt.rowsLabel || $attrs.rowsLabel;
  var rowsOrderBy = opt.rowsOrderBy || $attrs.rowsOrderBy;

  var rowsScale;
  if (opt.rowsScale) {
    rowsScale = opt.rowsScale;
  } else if ($attrs.rowsScale) {
    rowsScale = $scope.$eval($attrs.rowsScale);
  }
  //

  var vals = opt.vals || $attrs.vals;

  opt.type = type;
  opt.render = render;
  opt.inputData = inputData;
  opt.axisBoundaries = axisBoundaries;
  opt.width = width;
  opt.height = height;
  opt.margins = margins;
  opt.vals = vals;

  // TODO: Separate using a dynamic options convention
  opt.xCol = xCol;
  opt.yCol = yCol;

  opt.colsFilter = colsFilter;
  opt.colsLabel = colsLabel;
  opt.colsOrderBy = colsOrderBy;
  opt.rowsFilter = rowsFilter;
  opt.rowsLabel = rowsLabel;
  opt.rowsOrderBy = rowsOrderBy;
  opt.rowsScale = rowsScale;
  //


  opt.visCtor = u.reflection.evaluateFullyQualifiedTypeName(typeStr);

  typeStr += 'Options';
  var ctor;
  try {
    ctor = u.reflection.evaluateFullyQualifiedTypeName(typeStr);
  } catch (ex) {
    // No customized options defined for this visualization. We will use the standard ones.
    ctor = vs.ui.VisualizationOptions;
  }

  opt.visOptionsCtor = ctor;

  var ret = u.reflection.applyConstructor(ctor, [opt, inputData]);

  if (!(ret instanceof vs.ui.VisualizationOptions)) {
    throw new vs.ui.UiException(typeStr + ' is not an instance of vs.ui.VisualizationOptions.');
  }

  return ret;
};
