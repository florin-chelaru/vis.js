/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/4/2015
 * Time: 2:40 PM
 */

goog.provide('vs.directives.DataContext');

goog.require('vs.ui.DataHandler');

/**
 * @param {angular.Scope} $scope
 * @param {angular.$compile} $compile
 * @constructor
 * @extends {ngu.Directive}
 */
vs.directives.DataContext = function($scope, $compile) {
  ngu.Directive.apply(this, arguments);

  /**
   * @type {angular.$compile}
   * @private
   */
  this._$compile = $compile;

  /**
   * @type {vs.ui.DataHandler}
   * @private
   */
  this._handler = null;

  /**
   * @type {Object.<string, vs.ui.VisualContext>}
   * @private
   */
  this._visMap = {};
};

goog.inherits(vs.directives.DataContext, ngu.Directive);

/**
 * @type {vs.ui.DataHandler}
 * @name vs.directives.DataContext#handler
 */
vs.directives.DataContext.prototype.handler;
/*

/!**
 * @type {string}
 * @name vs.directives.DataContext#template
 *!/
vs.directives.DataContext.prototype.template;
*/

Object.defineProperties(vs.directives.DataContext.prototype, {
  'handler': { get: /** @type {function (this:vs.directives.DataContext)} */ (function() { return this._handler; })}/*,
  'template': { get: /!** @type {function (this:vs.directives.DataContext)} *!/ (function() { return this._template; })}*/
});

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.DataContext.prototype.link = function($scope, $element, $attrs, controller) {
  for (var key in $scope) {
    if (!$scope.hasOwnProperty(key)) { continue; }
    if ($scope[key] instanceof vs.ui.DataHandler) {
      this._handler = $scope[key];
      break;
    }
  }

  if (!this._handler) { throw new vs.ui.UiException('No vs.ui.DataHandler instance found in current scope'); }
  $scope['dataHandler'] = this._handler;

  var visCtxtFmt = '<div vs-context="dataHandler.visualizations[%s]" vs-data="dataHandler.data" class="visualization %s" id="vs-%s"></div>';
  var decoratorFmt = '<div class="%s" vs-options="dataHandler.visualizations[%s].decorators.elem[%s].options"></div>';

  var self = this;
  var $compile = this._$compile;
  $scope.$watchCollection(
    function() { return self._handler['visualizations']; },
    function(visualizations, oldVal) {
      var t = $element;

      var newContexts = {};

      u.fast.forEach(visualizations, function(visContext, i) {
        var id = visContext['id'];
        if (id == undefined) {
          visContext['id'] = id = u.generatePseudoGUID(8);
        }

        newContexts[id] = visContext;

        if (!(id in self._visMap)) {
          var v = $(goog.string.format(visCtxtFmt, i, visContext['decorators']['cls'].join(' '), id)).appendTo(t);
          u.fast.forEach(visContext['decorators']['elem'], function (decorator, j) {
            var d = $(goog.string.format(decoratorFmt, decorator['cls'], i, j)).appendTo(v);
          });
          self._visMap[id] = visContext;
          $compile(v)($scope);
        }
      });

      u.each(self._visMap, function(id) {
        if (!(id in newContexts)) {
          $('vs-' + id).remove();
        }
      });
    });
};
