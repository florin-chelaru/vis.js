/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 4:15 PM
 */

goog.provide('vis.plugins.svg.ScatterPlotOptions');

goog.require('vis.ui.VisualizationOptions');

goog.require('vis.models.DataSource');
goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');

/**
 * @param {{xCol: number=, yCol: number=,
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number=, visCtor: function(new: vis.ui.Visualization)=, render: string=,
 *   visOptionsCtor: function(new: vis.ui.VisualizationOptions)=}} options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.VisualizationOptions
 */
vis.plugins.svg.ScatterPlotOptions = function(options, data) {
  vis.ui.VisualizationOptions.apply(this, arguments);

  /**
   * @type {number}
   * @private
   */
  this._xCol = (options.xCol == undefined) ? 0 : options.xCol;

  /**
   * @type {number}
   * @private
   */
  this._yCol = (options.yCol != undefined) ? options.yCol : ((this._xCol == 0) ? 1 : 0);

  if (data.ncols <= this._xCol || data.ncols <= this._yCol || this._xCol < 0 || this._yCol < 0) {
    throw new vis.ui.UiException('The number of columns in the data is not consistent with the xCol and yCol indices.');
  }
};

goog.inherits(vis.plugins.svg.ScatterPlotOptions, vis.ui.VisualizationOptions);

Object.defineProperties(vis.plugins.svg.ScatterPlotOptions.prototype, {
  xCol: { get: function() { return this._xCol; } },
  yCol: { get: function() { return this._yCol; } }
});
