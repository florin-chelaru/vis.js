/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/3/2015
 * Time: 5:46 PM
 */

goog.provide('vs.directives.Navbar');

goog.require('vs.directives.Directive');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.Navbar = function() {
  vs.directives.Directive.apply(this, arguments);

  /**
   * @type {jQuery}
   * @private
   */
  this._$navbar = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._$container = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._$header = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._$left = null;

  /**
   * @type {jQuery}
   * @private
   */
  this._$right = null;
};

goog.inherits(vs.directives.Navbar, vs.directives.Directive);

/**
 * @type {jQuery}
 * @name vs.directives.Navbar#$navbar
 */
vs.directives.Navbar.prototype.$navbar;

/**
 * @type {jQuery}
 * @name vs.directives.Navbar#$container
 */
vs.directives.Navbar.prototype.$container;

/**
 * @type {jQuery}
 * @name vs.directives.Navbar#$header
 */
vs.directives.Navbar.prototype.$header;

/**
 * @type {jQuery}
 * @name vs.directives.Navbar#$left
 */
vs.directives.Navbar.prototype.$left;

/**
 * @type {jQuery}
 * @name vs.directives.Navbar#$right
 */
vs.directives.Navbar.prototype.$right;

Object.defineProperties(vs.directives.Navbar.prototype, {
  $navbar: { get: /** @type {function (this:vs.directives.Navbar)} */ (function() { return this._$navbar; })},
  $container: { get: /** @type {function (this:vs.directives.Navbar)} */ (function() { return this._$container; })},
  $header: { get: /** @type {function (this:vs.directives.Navbar)} */ (function() { return this._$header; })},
  $left: { get: /** @type {function (this:vs.directives.Navbar)} */ (function() { return this._$left; })},
  $right: { get: /** @type {function (this:vs.directives.Navbar)} */ (function() { return this._$right; })}
});

/**
 * @param {angular.Scope} $scope
 * @param {jQuery} $element
 * @param {angular.Attributes} $attrs
 * @param controller
 * @override
 */
vs.directives.Navbar.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link['post'].apply(this, arguments);
  var $window = $scope['vsWindow']['handler']['$window'];

  /** @type {vs.ui.DataHandler} */
  var dataHandler = $scope['vsDataContext']['handler']['handler'];

  var $navbar = $('<div class="nav navbar navbar-default navbar-fixed-top" style="position: absolute;"></div>').appendTo($window);
  var $container = $('<div class="container-fluid"></div>').appendTo($navbar);
  var $header = $('<div class="navbar-header"><a class="navbar-brand" href="#">' + dataHandler['name'] + '</a></div>').appendTo($container);
  var $left = $('<ul class="nav navbar-nav navbar-left"></ul>').appendTo($container);
  var $right = $('<ul class="nav navbar-nav navbar-right"></ul>').appendTo($container);


  $navbar.on('mousedown', function(e) {
    $window.trigger(new $.Event('mousedown', {target: $window[0], originalEvent: e, 'pageX': e.pageX, 'pageY': e.pageY}));
  });

  this._$navbar = $navbar;
  this._$container = $container;
  this._$header = $header;
  this._$left = $left;
  this._$right = $right;
};

