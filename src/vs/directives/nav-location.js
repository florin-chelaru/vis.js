/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 11/5/2015
 * Time: 11:03 AM
 */

goog.provide('vs.directives.NavLocation');

goog.require('vs.directives.Directive');
goog.require('vs.models.GenomicRangeQuery');

/**
 * @constructor
 * @extends {vs.directives.Directive}
 */
vs.directives.NavLocation = function($scope, $templateCache) {
  vs.directives.Directive.apply(this, arguments);

  /**
   * Angular template service
   * @private
   */
  this._$templateCache = $templateCache;

  /**
   * @type {jQuery}
   * @private
   */
  this._$textbox = null;
};

goog.inherits(vs.directives.NavLocation, vs.directives.Directive);

/**
 * @type {jQuery}
 * @name vs.directives.NavLocation#$textbox
 */
vs.directives.NavLocation.prototype.$textbox;

Object.defineProperties(vs.directives.NavLocation.prototype, {
  $textbox: { get: /** @type {function (this:vs.directives.NavLocation)} */ (function () { return this._$textbox; })}
});

/**
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 * @override
 */
vs.directives.NavLocation.prototype.link = function($scope, $element, $attrs, controller) {
  vs.directives.Directive.prototype.link.post.apply(this, arguments);
  var $navbarLeft = $scope['vsNavbar'].handler.$left;
  /** @type {vs.ui.DataHandler} */
  var dataHandler = $scope['vsDataContext'].handler.handler;
  var data = dataHandler.data;

  var range = vs.models.GenomicRangeQuery.extract(data.query);

  this._$textbox = $(
    '<li class="navbar-form navbar-left">' +
      '<div class="form-group">'+
        '<input type="text" class="form-control" placeholder="Location"/>'+
      '</div> ' + // <-- the space at the end is important so that there will be a small space between controls
      '<button type="submit" class="btn btn-default">Submit</button>' +
    '</li>').appendTo($navbarLeft);
};
