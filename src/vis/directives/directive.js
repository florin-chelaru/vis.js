/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:08 PM
 */

goog.provide('vis.directives.Directive');

/**
 * @param $scope Angular scope
 * @constructor
 */
vis.directives.Directive = function($scope) {
  /**
   * @private
   */
  this._scope = $scope;
};

Object.defineProperties(vis.directives.Directive.prototype, {
  scope: { get: function() { return this._scope; } }
});

vis.directives.Directive.prototype.link = function($scope, $element, $attrs) {};

/**
 * @param {string} name
 * @param {function(new: vis.directives.Directive)} controllerCtor
 * @param {Array} [args]
 * @param {Object.<string, *>} [options]
 * @returns {{controller: *[], link: Function, restrict: string, transclude: boolean, replace: boolean}}
 */
vis.directives.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(args || []);
    params.unshift($scope);
    this.handler = vis.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if ($.isFunction(controllerCtor.prototype.link)) {
    link = function ($scope, $element, $attrs) {
      var ctrl = $scope[name];
      return ctrl.handler.link($scope, $element, $attrs, ctrl);
    };
  } else {
    link = {};
    if (controllerCtor.prototype.link.pre) {
      link.pre = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl.handler.link.pre.call(ctrl.handler, $scope, $element, $attrs, ctrl);
      };
    }
    if (controllerCtor.prototype.link.post) {
      link.post = function($scope, $element, $attrs) {
        var ctrl = $scope[name];
        ctrl.handler.link.post.call(ctrl.handler, $scope, $element, $attrs, ctrl);
      };
    }
  }

  return angular.extend({}, options, { link: link, controller: controller, controllerAs: name });
};
