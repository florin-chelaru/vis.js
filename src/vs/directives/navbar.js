/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/3/2015
 * Time: 5:46 PM
 */

goog.provide('vs.directives.Navbar');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Navbar = function() {
  vs.directives.Directive.apply(this, arguments);
};

goog.inherits(vs.directives.Navbar, vs.directives.Directive);

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.Navbar.prototype.link = function($scope, $element, $attrs, controller) {
  var $window = $element.parent();
  var $navbar = $(
    '<div class="nav navbar navbar-default navbar-fixed-top" style="position: absolute;">' +
      '<div class="container-fluid">' +
        '<div class="navbar-header"><a class="navbar-brand" href="#">Gwasvis</a></div>' +
      '</div>' +
    '</div>').appendTo($window);

  $navbar.on('mousedown', function(e) {
    $window.trigger(new $.Event('mousedown', {target: $window[0], originalEvent: e, 'pageX': e.pageX, 'pageY': e.pageY}));
  });
};

