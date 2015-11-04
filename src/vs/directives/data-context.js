/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/4/2015
 * Time: 2:40 PM
 */

goog.provide('vs.directives.DataContext');

goog.require('vs.directives.Directive');
goog.require('vs.ui.DataHandler');

/**
 * @param $scope
 * @param $templateCache
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.DataContext = function($scope, $templateCache) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular template service
   * @private
   */
  this._$templateCache = $templateCache;

  /**
   * @type {vs.ui.DataHandler}
   * @private
   */
  this._handler = null;

  for (var key in $scope) {
    if (!$scope.hasOwnProperty(key)) { continue; }
    if ($scope[key] instanceof vs.ui.DataHandler) {
      this._handler = $scope[key];
      break;
    }
  }

  if (!this._handler) { throw new vs.ui.UiException('No vs.ui.DataHandler instance found in current scope'); }
  $scope.dataHandler = this._handler;

  /**
   * @type {string}
   * @private
   */
  this._template = null;

  var visCtxtFmt = '<div vs-context="dataHandler.visualizations[%s]" vs-data="dataHandler.data" class="visualization %s"></div>';
  var decoratorFmt = '<div class="%s" vs-options="dataHandler.visualizations[%s].decorators.elem[%s].options"></div>';

  var t = $('<div></div>');
  this._handler.visualizations.forEach(function(visContext, i) {
    var v = $(goog.string.format(visCtxtFmt, i, visContext.decorators.cls.join(' '))).appendTo(t);
    visContext.decorators.elem.forEach(function(decorator, j) {
      var d = $(goog.string.format(decoratorFmt, decorator.cls, i, j)).appendTo(v);
    });
  });
  var template = t.html();
  var templateId = u.generatePseudoGUID(10);
  this._$templateCache.put(templateId, template);
  this._template = templateId;
};

goog.inherits(vs.directives.DataContext, vs.directives.Directive);

/**
 * @type {vs.ui.DataHandler}
 * @name vs.directives.DataContext#handler
 */
vs.directives.DataContext.prototype.handler;

/**
 * @type {string}
 * @name vs.directives.DataContext#template
 */
vs.directives.DataContext.prototype.template;

Object.defineProperties(vs.directives.DataContext.prototype, {
  handler: { get: /** @type {function (this:vs.directives.DataContext)} */ (function() { return this._handler; })},
  template: { get: /** @type {function (this:vs.directives.DataContext)} */ (function() { return this._template; })}
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.DataContext.prototype.link = function($scope, $element, $attrs, controller) {};
