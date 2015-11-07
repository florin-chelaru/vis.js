/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:08 PM
 */

goog.provide('vs.directives.Directive');

/**
 * @param {angular.Scope} $scope Angular scope
 * @constructor
 */
vs.directives.Directive = function($scope) {
  /**
   * @type {angular.Scope}
   * @private
   */
  this._$scope = $scope;

  /**
   * @type {jQuery}
   * @private
   */
  this._$element = null;

  /**
   * @private
   */
  this._$attrs = null;
};

/**
 * @type {angular.Scope}
 * @name vs.directives.Directive#$scope
 */
vs.directives.Directive.prototype.$scope;

/**
 * @type {jQuery}
 * @name vs.directives.Directive#$element
 */
vs.directives.Directive.prototype.$element;

/**
 * @type {angular.Attributes}
 * @name vs.directives.Directive#$attrs
 */
vs.directives.Directive.prototype.$attrs;

Object.defineProperties(vs.directives.Directive.prototype, {
  '$scope': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$scope; })},
  '$element': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$element; })},
  '$attrs': { get: /** @type {function (this:vs.directives.Directive)} */ (function() { return this._$attrs; })}
});

/**
 * @type {{pre: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))), post: (undefined|function(angular.Scope, jQuery, angular.Attributes, (*|undefined)))}|function(angular.Scope, jQuery, angular.Attributes, (*|undefined))}
 */
vs.directives.Directive.prototype.link = {

  'pre': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  },

  'post': function($scope, $element, $attrs, controller) {
    this._$element = $element;
    this._$attrs = $attrs;
  }
};

/**
 * @param {string} name
 * @param {function(new: vs.directives.Directive)} controllerCtor
 * @param {Array} [args]
 * @param {Object.<string, *>} [options]
 * @returns {{controller: (Array|Function), link: Function, restrict: string, transclude: boolean, replace: boolean}}
 */
vs.directives.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(args || []);
    params.unshift($scope);

    // Usage of 'this' is correct in this scope: we are accessing the 'this' of the controller
    this['handler'] = u.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if (typeof controllerCtor.prototype.link == 'function') {
    link = function ($scope, $element, $attrs) {
      var ctrl = $scope[name];
      return ctrl['handler'].link($scope, $element, $attrs, ctrl);
    };
  } else {
    link = {};
    if ('pre' in controllerCtor.prototype.link) {
      link['pre'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['pre'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
    if ('post' in controllerCtor.prototype.link) {
      link['post'] = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl['handler'].link['post'].call(ctrl['handler'], $scope, $element, $attrs, ctrl);
      };
    }
  }

  return u.extend({}, options, { 'link': link, 'controller': controller, 'controllerAs': name });
};
