/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:01 PM
 */

goog.provide('vs.directives.Brushing');

goog.require('vs.directives.Visualization');
goog.require('vs.directives.GraphicDecorator');

goog.require('vs.ui.svg.SvgBrushing');
goog.require('vs.ui.canvas.CanvasBrushing');

/**
 * @param {angular.Scope} $scope
 * @param {vs.async.TaskService} taskService
 * @param {angular.$timeout} $timeout
 * @param $rootScope Angular root scope
 * @constructor
 * @extends {vs.directives.GraphicDecorator}
 */
vs.directives.Brushing = function($scope, taskService, $timeout, $rootScope) {
  vs.directives.GraphicDecorator.apply(this, [$scope, taskService, $timeout, true /* Overrides VisHandler */]);

  /**
   * Angular root scope
   * @private
   */
  this._$rootScope = $rootScope;
};

goog.inherits(vs.directives.Brushing, vs.directives.GraphicDecorator);

vs.directives.Brushing.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.GraphicDecorator.prototype.link.apply(this, arguments);

  this['handler']['brushing'].addListener(function(e) {
    this._$rootScope.$broadcast('brushing', e);
  }, this);

  var self = this;
  $scope.$on('brushing', function(e, brushingEvent) {
    self['handler'].brush(brushingEvent);
  });
};

/**
 * @param {{$scope: angular.Scope, $element: jQuery, $attrs: angular.Attributes, $timeout: angular.$timeout, taskService: vs.async.TaskService}} $ng
 * @param {jQuery} $targetElement
 * @param {vs.ui.VisHandler} target
 * @param {Object.<string, *>} options
 * @returns {vs.ui.Decorator}
 * @override
 */
vs.directives.Brushing.prototype.createDecorator = function($ng, $targetElement, target, options) {
  switch (target['render']) {
    case 'svg':
      return new vs.ui.svg.SvgBrushing($ng, $targetElement, target, options);
    case 'canvas':
      return new vs.ui.canvas.CanvasBrushing($ng, $targetElement, target, options);
  }
  return null;
};
