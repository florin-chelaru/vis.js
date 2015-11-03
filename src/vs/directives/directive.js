/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/22/2015
 * Time: 7:08 PM
 */

goog.provide('vs.directives.Directive');

/**
 * @param $scope Angular scope
 * @constructor
 */
vs.directives.Directive = function($scope) {
  /**
   * @private
   */
  this._$scope = $scope;
};

Object.defineProperties(vs.directives.Directive.prototype, {
  $scope: { get: function() { return this._$scope; } }
});

vs.directives.Directive.prototype.link = function($scope, $element, $attrs) {};

/**
 * @param {string} name
 * @param {function(new: vs.directives.Directive)} controllerCtor
 * @param {Array} [args]
 * @param {Object.<string, *>} [options]
 * @returns {{controller: *[], link: Function, restrict: string, transclude: boolean, replace: boolean}}
 */
vs.directives.Directive.createNew = function(name, controllerCtor, args, options) {
  var controller = ['$scope', function($scope) {
    var params = [].concat(args || []);
    params.unshift($scope);

    // Usage of 'this' is correct in this scope: we are accessing the 'this' of the controller
    this.handler = u.reflection.applyConstructor(controllerCtor, params);
  }];
  var link;
  if (typeof controllerCtor.prototype.link == 'function') {
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
