/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 10/21/2015
 * Time: 3:43 PM
 */

goog.provide('vs.ui.DataContext');

goog.require('vs.models.DataSource');
goog.require('vs.models.Query');

/**
 * @interface
 */
vs.ui.DataContext = function() {};

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
 * @type {Array.<vs.ui.VisualizationOptions>}
 * @name vs.ui.DataContext#visualizations
 */
vs.ui.DataContext.prototype.visualizations;

/**
 * @type {u.Event.<vs.models.DataSource>}
 * @name vs.ui.DataContext#dataChanged
 */
vs.ui.DataContext.prototype.dataChanged;

Object.defineProperties(vs.ui.DataContext.prototype, {
  name: { get: /** @type {function (this:vs.ui.DataContext)} */ (function() { throw new u.AbstractMethodException(); }) },

  data: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { throw new u.AbstractMethodException(); }),
    set: /** @type {function (this:vs.ui.DataContext)} */ (function(value) { throw new u.AbstractMethodException(); })
  },

  dataChanged: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { throw new u.AbstractMethodException(); })
  },

  children: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { throw new u.AbstractMethodException(); })
  },

  visualizations: {
    get: /** @type {function (this:vs.ui.DataContext)} */ (function() { throw new u.AbstractMethodException(); })
  }
});

/**
 * @param {vs.models.Query|Array.<vs.models.Query>} q
 * @returns {Promise.<vs.models.DataSource>}
 */
vs.ui.DataContext.prototype.query = function(q) { throw new u.AbstractMethodException(); };
