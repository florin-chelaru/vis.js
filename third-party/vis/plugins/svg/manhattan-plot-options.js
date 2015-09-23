/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/23/2015
 * Time: 2:02 PM
 */

goog.provide('vis.plugins.svg.ManhattanPlotOptions');

goog.require('vis.ui.VisualizationOptions');
goog.require('goog.array');

/**
 * @param {{cols: number=,
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number=, visCtor: function(new: vis.ui.Visualization)=, render: string=,
 *   visOptionsCtor: function(new: vis.ui.VisualizationOptions)=}} options
 * @param {vis.models.DataSource} data
 * @constructor
 * @extends vis.ui.VisualizationOptions
 */
vis.plugins.svg.ManhattanPlotOptions = function(options, data) {
  vis.ui.VisualizationOptions.apply(this, arguments);

  /*
   opt.colsFilter = colsFilter;
   opt.colsLabel = colsLabel;
   opt.colsOrderBy = colsOrderBy;
   opt.rowsFilter = rowsFilter;
   opt.rowsLabel = rowsLabel;
   opt.rowsOrderBy = rowsOrderBy;
   opt.rowsScale = rowsScale;
   */

  /**
   * @type {Array.<number>}
   * @private
   */
  this._colsFilter = options.colsFilter || goog.array.range(data.ncols);

  /**
   * @type {string}
   * @private
   */
  this._colsLabel = options.colsLabel || data.cols[0].label;

  /**
   * @type {string}
   * @private
   */
  this._colsOrderBy = options.colsOrderBy || data.cols[0].label;

  /**
   * @type {Array.<number>}
   * @private
   */
  this._rowsFilter = options.rowsFilter || goog.array.range(data.nrows);

  /**
   * @type {string}
   * @private
   */
  this._rowsLabel = options.rowsLabel || data.rows[0].label;

  /**
   * @type {string}
   * @private
   */
  this._rowsOrderBy = options.rowsOrderBy || data.rows[0].label;

  /**
   * @type {boolean}
   * @private
   */
  this._rowsScale = options.rowsScale == undefined ? true : options.rowsScale;
};

goog.inherits(vis.plugins.svg.ManhattanPlotOptions, vis.ui.VisualizationOptions);

Object.defineProperties(vis.plugins.svg.ManhattanPlotOptions.prototype, {
  colsFilter: { get: function() { return this._colsFilter; } },
  colsLabel: { get: function() { return this._colsLabel; } },
  colsOrderBy: { get: function() { return this._colsOrderBy; } },
  rowsFilter: { get: function() { return this._rowsFilter; } },
  rowsLabel: { get: function() { return this._rowsLabel; } },
  rowsOrderBy: { get: function() { return this._rowsOrderBy; } },
  rowsScale: { get: function() { return this._rowsScale; } },

  /**
   * @type {{x: vis.models.Boundaries, y: vis.models.Boundaries}}
   * @instance
   * @memberof vis.ui.ManhattanPlotOptions
   */
  axisBoundaries: {
    get: function() {
      var xBoundaries, yBoundaries;

      if (this._axisBoundaries) {
        xBoundaries = this._axisBoundaries.x;
        yBoundaries = this._axisBoundaries.y;
      }

      var rowsArr = this._data.getRows(this._rowsLabel);
      if (!xBoundaries) {
        xBoundaries = rowsArr.boundaries;
      }
      if (!xBoundaries) {
        if (!this._data.nrows) {
          xBoundaries = new vis.models.Boundaries(0, 0);
        } else {
          if (typeof rowsArr.d[0] == 'number') {
            xBoundaries = new vis.models.Boundaries(
              Math.min.apply(undefined, rowsArr.d),
              Math.max.apply(undefined, rowsArr.d)
            );
          }
        }
      }

      var valsArr = this._data.getVals(this._vals);
      if (!yBoundaries) {
        yBoundaries = valsArr.boundaries ||
          new vis.models.Boundaries(
            Math.min.apply(undefined, valsArr.d),
            Math.max.apply(undefined, valsArr.d)
          );
      }

      return {
        x: xBoundaries,
        y: yBoundaries
      };
    },
    set: function(value) { this._axisBoundaries = value; this.redrawRequired(); }
  }
});
