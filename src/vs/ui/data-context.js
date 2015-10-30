/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 3:43 PM
 */

goog.provide('vs.ui.DataContext');

goog.require('vs.models.DataSource');
goog.require('vs.ui.VisualContext');
goog.require('vs.models.Query');

/**
 * @param {vs.ui.DataContext|{data: vs.models.DataSource, visualizations: (Array.<vs.ui.VisualContext>|undefined), children: (Array.<vs.ui.DataContext>|undefined), name: (string|undefined)}} options
 * @constructor
 */
vs.ui.DataContext = function(options) {
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
   * @type {Array.<vs.ui.DataContext>}
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
 * @name vs.ui.DataContext#name
 */
vs.ui.DataContext.prototype.name;

/**
 * @type {vs.models.DataSource}
 * @name vs.ui.DataContext#data
 */
vs.ui.DataContext.prototype.data;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.ui.DataContext#dataChanged
 */
vs.ui.DataContext.prototype.dataChanged;

/**
 * @type {Array.<vs.ui.DataContext>}
 * @name vs.ui.DataContext#children
 */
vs.ui.DataContext.prototype.children;

/**
 * @type {Array.<vs.ui.VisualContext>}
 * @name vs.ui.DataContext#visualizations
 */
vs.ui.DataContext.prototype.visualizations;

Object.defineProperties(vs.ui.DataContext.prototype, {
  name: { get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._name; }) },

  data: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._data; }),
    set: /** @type {function (this:vs.ui.DataContext)} */ (function(value) { this._data = value; })
  },

  dataChanged: { get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this.data.changed; })},

  children: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._children; })
  },

  visualizations: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { return this._visualizations; })
  }
});
