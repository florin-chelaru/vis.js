/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 8:42 AM
 */

goog.provide('vis.plugins.canvas.ScatterPlotOptions');

goog.require('vis.ui.canvas.CanvasVisualizationOptions');

/**
 * @param {{xCol: number=, yCol: number=,
 *   singleBuffer: boolean=,
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number=, visCtor: function(new: vis.ui.Visualization)=, render: string=,
 *   visOptionsCtor: function(new: vis.ui.VisualizationOptions)=}} options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.canvas.CanvasVisualizationOptions
 */
vis.plugins.canvas.ScatterPlotOptions = function(options, data) {
  vis.ui.canvas.CanvasVisualizationOptions.apply(this, arguments);

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

goog.inherits(vis.plugins.canvas.ScatterPlotOptions, vis.ui.canvas.CanvasVisualizationOptions);

Object.defineProperties(vis.plugins.canvas.ScatterPlotOptions.prototype, {
  xCol: { get: function() { return this._xCol; } },
  yCol: { get: function() { return this._yCol; } }
});
