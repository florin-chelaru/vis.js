/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/27/2015
 * Time: 9:42 AM
 */

goog.provide('vis.ui.VisualizationFactory');

goog.require('vis.Configuration');
goog.require('vis.ui.Visualization');
goog.require('vis.ui.UiException');

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
 * @param scope
 * @param element
 * @param attrs
 * @returns {vis.ui.Visualization}
 */
vis.ui.VisualizationFactory.prototype.createNew = function(scope, element, attrs) {
  if (!attrs.type) { throw new vis.ui.UiException('Expected attribute: type'); }

  var renders = this._visMap[attrs.type];
  if (!renders) {
    throw new vis.ui.UiException('Undefined visualization type: ' + attrs.type + '. Did you forget to register it in the configuration?');
  }

  var typeStr;
  if (!attrs.render) {
    if (angular.isObject(renders)) {
      var defaultRender = renders['default'];

      if (!defaultRender) {
        throw new vis.ui.UiException('Default renderer not defined for visualization ' + attrs.type + '.')
      }

      typeStr = renders[defaultRender];
      if (!typeStr) {
        throw new vis.ui.UiException('Default renderer ' + defaultRender + ' does not exist in the list of renderers for ' + attrs.type + '.');
      }
    } else {
      typeStr = renders;
    }
  } else {
    if (angular.isObject(renders)) {
      typeStr = renders[attrs.render];
      if (!typeStr) {
        throw new vis.ui.UiException('Renderer ' + attrs.render + ' does not exist in the list of renderers for ' + attrs.type + '.');
      }
    } else {
      throw new vis.ui.UiException('Renderer ' + attrs.render + ' is not defined for ' + attrs.type + '.');
    }
  }

  var ctor = vis.reflection.evaluateFullyQualifiedTypeName(typeStr);
  var ret = vis.reflection.applyConstructor(ctor, [scope, element, attrs]);

  if (!(ret instanceof vis.ui.Visualization)) {
    throw new vis.ui.UiException(typeStr + ' is not an instance of vis.ui.Visualization.');
  }

  return ret;
};
