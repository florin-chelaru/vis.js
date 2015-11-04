/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 3:43 PM
 */

goog.provide('vs.ui.DataHandler');

goog.require('vs.models.DataSource');
goog.require('vs.ui.VisualContext');
goog.require('vs.models.Query');

/**
 * @param {vs.ui.DataHandler|{data: vs.models.DataSource, visualizations: (Array.<vs.ui.VisualContext>|undefined), children: (Array.<vs.ui.DataHandler>|undefined), name: (string|undefined)}} options
 * @constructor
 */
vs.ui.DataHandler = function(options) {
  /**
   * @type {vs.models.DataSource}
   * @private
   */
  this._data = options.data;

  /**
   * @type {Array.<vs.ui.VisualContext>}
   * @private
   */
  this._visualizations = options.visualizations || [];

  /**
   * @type {Array.<vs.ui.DataHandler>}
   * @private
   */
  this._children = options.children || [];

  /**
   * @type {string}
   * @private
   */
  this._name = options.name || '';
};

/**
 * @type {string}
 * @name vs.ui.DataHandler#name
 */
vs.ui.DataHandler.prototype.name;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.DataHandler#data
 */
vs.ui.DataHandler.prototype.data;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.ui.DataHandler#dataChanged
 */
vs.ui.DataHandler.prototype.dataChanged;

/**
 * @type {Array.<vs.ui.DataHandler>}
 * @name vs.ui.DataHandler#children
 */
vs.ui.DataHandler.prototype.children;

/**
 * @type {Array.<vs.ui.VisualContext>}
 * @name vs.ui.DataHandler#visualizations
 */
vs.ui.DataHandler.prototype.visualizations;

Object.defineProperties(vs.ui.DataHandler.prototype, {
  name: { get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._name; }) },

  data: {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._data; }),
    set: /** @type {function (this:vs.ui.DataHandler)} */ (function(value) { this._data = value; })
  },

  dataChanged: { get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this.data.changed; })},

  children: {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._children; })
  },

  visualizations: {
    get: /** @type {function (this:vs.ui.DataHandler)} */ (function() { return this._visualizations; })
  }
});
