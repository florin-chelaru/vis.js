/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 8/30/2015
 * Time: 8:28 AM
 */

goog.provide('vis.directives.Directive');

/**
 * @param {{require: string=, restrict: string=, scope: boolean|Object=, controller: function=, template: string=, templateUrl: string=,
 *          priority: number=, transclude: boolean=, templateNamespace: string=, controllerAs: string=,
 *          bindToController: boolean=}} [options]
 * @constructor
 * @abstract
 */
vis.directives.Directive = function(options) {
  if (!options) { options = {}; }
  this.require = options.require;
  this.restrict = options.restrict;
  this._scope = options.scope;
  this._controller = options.controller;
  this._template = options.template;
  this._templateUrl = options.templateUrl;
  this.priority = options.priority;
  this._transclude = options.transclude;
  this._templateNamespace = options.templateNamespace;
  this._controllerAs = options.controllerAs;
  this._bindToController = options.bindToController;
};

/**
 * @enum {string}
 */
vis.directives.Directive.Restrict = {
  Attribute: 'A',
  Element: 'E',
  Class: 'C'
};

Object.defineProperties(vis.directives.Directive.prototype, {
  scope: {
    /** @returns {boolean|Object} */
    get: function() { return this._scope; }
  },
  controller: {
    /** @returns {function} */
    get: function() { return this._controller; }
  },
  template: {
    /** @returns {string} */
    get: function() { return this._template; }
  },
  templateUrl: {
    /** @returns {string} */
    get: function() { return this._templateUrl; }
  },
  transclude: {
    /** @returns {boolean} */
    get: function() { return this._transclude; }
  },
  templateNamespace: {
    /** @returns {string} */
    get: function() { return this._templateNamespace; }
  },
  controllerAs: {
    /** @returns {string} */
    get: function() { return this._controllerAs; }
  },
  bindToController: {
    /** @returns {boolean} */
    get: function() { return this._bindToController; }
  }
});

/**
 * See angular documentation for directives for description of the arguments
 * @param $scope
 * @param $element
 * @param $attrs
 * @param controller
 */
vis.directives.Directive.prototype.link = function($scope, $element, $attrs, controller) {};
