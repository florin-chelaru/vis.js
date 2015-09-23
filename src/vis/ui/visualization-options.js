/**
 * Created by Florin Chelaru ( florin [dot] chelaru [at] gmail [dot] com )
 * Date: 9/2/2015
 * Time: 2:23 PM
 */

goog.provide('vis.ui.VisualizationOptions');

goog.require('vis.models.Boundaries');
goog.require('vis.models.Margins');
goog.require('vis.models.DataSource');

/**
 * @param {{
 *   singleBuffer: boolean=,
 *   colsFilter: Array.<number>=, colsLabel: string=, colsOrderBy: string=,
 *   rowsFilter: Array.<number>=, rowsLabel: string=, rowsOrderBy: string=, rowsScale: boolean=,
 *   axisBoundaries: Object.<string, vis.models.Boundaries>=, margins: vis.models.Margins=,
 *   width: number=, height: number=, visCtor: function(new: vis.ui.Visualization)=, render: string=,
 *   visOptionsCtor: function(new: vis.ui.VisualizationOptions)= }} options
 * @param {vis.models.DataSource} [data]
 * @constructor
 */
vis.ui.VisualizationOptions = function(options, data) {
  /**
   * @type {Object.<string, vis.models.Boundaries>}
   * @protected
   */
  this._axisBoundaries = options.axisBoundaries;

  /**
   * @type {vis.models.Margins}
   * @protected
   */
  this._margins = options.margins ?
    new vis.models.Margins(options.margins.top, options.margins.left, options.margins.bottom, options.margins.right) :
    new vis.models.Margins(0, 0, 0, 0);

  /**
   * @type {number}
   * @protected
   */
  this._width = options.width == undefined ? 300 : options.width;

  /**
   * @type {number}
   * @protected
   */
  this._height = options.height == undefined ? 150 : options.height;

  /**
   * @type {string}
   * @private
   */
  this._vals = options.vals == undefined ? data.vals[0].label : options.vals;

  /**
   * @type {vis.models.DataSource}
   * @protected
   */
  this._data = data;

  /**
   * @type {number}
   * @private
   */
  this._dirty = 0;

  /**
   * @type {string}
   * @private
   */
  this._render = options.render;

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

  /**
   * @type {function(new: vis.ui.Visualization)}
   * @private
   */
  this._visCtor = options.visCtor;

  /**
   * @type {function(new: vis.ui.VisualizationOptions)}
   * @private
   */
  this._visOptionsCtor = options.visOptionsCtor;

  /**
   * TODO: Later, separate this type of options into render options
   * @type {boolean}
   * @private
   */
  this._doubleBuffer = !options.singleBuffer;
};

Object.defineProperties(vis.ui.VisualizationOptions.prototype, {
  /**
   * @type {vis.models.DataSource}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  data: { get: function() { return this._data; } },

  /**
   * @type {boolean}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  dirty: {
    get: function() { return this._dirty; }
  },

  /**
   * @type {{x: vis.models.Boundaries, y: vis.models.Boundaries}}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  axisBoundaries: {
    get: function() {
      var xBoundaries, yBoundaries;

      if (this._axisBoundaries) {
        xBoundaries = this._axisBoundaries.x;
        yBoundaries = this._axisBoundaries.y;
      }

      var valsArr = this._data.getVals(this._vals);
      if (!xBoundaries) { xBoundaries = valsArr.boundaries; }
      if (!yBoundaries) { yBoundaries = valsArr.boundaries; }

      var dataBoundaries;
      if (!xBoundaries || !yBoundaries) {
        dataBoundaries = new vis.models.Boundaries(
          Math.min.apply(undefined, valsArr.d),
          Math.max.apply(undefined, valsArr.d)
        );
      }

      if (!xBoundaries) { xBoundaries = dataBoundaries; }
      if (!yBoundaries) { yBoundaries = dataBoundaries; }

      return {
        x: xBoundaries,
        y: yBoundaries
      };
    },
    set: function(value) { this._axisBoundaries = value; this.redrawRequired(); }
  },

  /**
   * @type {vis.models.Margins}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  margins: {
    get: function() { return this._margins; },
    set: function(value) {
      if (!this._margins.equals(value) &&
          value.left + value.right <= this._width &&
          value.top + value.bottom <= this._height) {
        this._margins = value;
        this.redrawRequired();
      }
    }
  },
  width: {
    get: function() { return this._width; },
    set: function(value) {
      if (value != this._width && value >= this._margins.left + this._margins.right) {
        this._width = value;
        this.redrawRequired();
      }
    }
  },
  height: {
    get: function() { return this._height; },
    set: function(value) {
      if (value != this._height && value >= this._margins.top + this._margins.bottom) {
        this._height = value;
        this.redrawRequired();
      }
    }
  },

  /**
   * @type {string}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  vals: { get: function() { return this._vals; } },

  /**
   * @type {string}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  render: { get: function() { return this._render; } },

  colsFilter: { get: function() { return this._colsFilter; } },
  colsLabel: { get: function() { return this._colsLabel; } },
  colsOrderBy: { get: function() { return this._colsOrderBy; } },
  rowsFilter: { get: function() { return this._rowsFilter; } },
  rowsLabel: { get: function() { return this._rowsLabel; } },
  rowsOrderBy: { get: function() { return this._rowsOrderBy; } },
  rowsScale: { get: function() { return this._rowsScale; } },

  /**
   * @type {function(new: vis.ui.Visualization)}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  visCtor: { get: function() { return this._visCtor; } },

  /**
   * @type {function(new: vis.ui.VisualizationOptions)}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  visOptionsCtor: { get: function() { return this._visOptionsCtor; } },

  /**
   * @type {{x: number, y: number}}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  dimensions: {
    get: function() {
      return { x: this.width, y: this.height };
    }
  },

  /**
   * @type {{x: number, y: number}}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  origins: {
    get: function() { return { x: this.margins.left, y: this.height - this.margins.bottom }; }
  },

  /**
   * @type {{x: function(number): number, y: function(number): number}}
   * @instance
   * @memberof vis.ui.VisualizationOptions
   */
  scales: {
    get: function() {
      var boundaries = this.axisBoundaries;
      return {
        x: d3.scale.linear()
          .domain([boundaries.x.min, boundaries.x.max])
          .range([0, this.width - this.margins.left - this.margins.right]),
        y: d3.scale.linear()
          .domain([boundaries.y.min, boundaries.y.max])
          .range([this.height - this.margins.top - this.margins.bottom, 0])
      }
    }
  },

  doubleBuffer: { get: function() { return this._doubleBuffer; } }
});

/**
 */
vis.ui.VisualizationOptions.prototype.redrawRequired = function() { ++this._dirty; };
