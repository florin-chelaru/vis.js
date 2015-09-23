/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 8:46 AM
 */

goog.provide('vis.ui.canvas.CanvasVisualizationOptions');

goog.require('vis.ui.VisualizationOptions');

/**
 * @param {{singleBuffer: boolean=,
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number=, visCtor: function(new: vis.ui.Visualization)=, render: string=,
 *   visOptionsCtor: function(new: vis.ui.VisualizationOptions)=}} options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.VisualizationOptions
 */
vis.ui.canvas.CanvasVisualizationOptions = function(options, data) {
  vis.ui.VisualizationOptions.apply(this, arguments);

  /**
   * @type {boolean}
   * @private
   */
  this._doubleBuffer = !options.singleBuffer;
};

goog.inherits(vis.ui.canvas.CanvasVisualizationOptions, vis.ui.VisualizationOptions);

Object.defineProperties(vis.ui.canvas.CanvasVisualizationOptions.prototype, {
  doubleBuffer: { get: function() { return this._doubleBuffer; } }
});
