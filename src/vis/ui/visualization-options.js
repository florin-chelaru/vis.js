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
 *   boundaries: vis.models.Boundaries=, margins: vis.models.Margins=,
 *   width: number=, height: number= }} options
 * @param {vis.models.DataSource} [data]
 * @constructor
 */
vis.ui.VisualizationOptions = function(options, data) {
  /**
   * @type {vis.models.Boundaries}
   * @protected
   */
  this._boundaries = options.boundaries;

  /**
   * @type {vis.models.Margins}
   * @protected
   */
  this._margins = options.margins || new vis.models.Margins(0, 0, 0, 0);

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
   * @type {vis.models.DataSource}
   * @protected
   */
  this._data = data;

  /**
   * @type {number}
   * @private
   */
  this._dirty = 0;
};

Object.defineProperties(vis.ui.VisualizationOptions.prototype, {
  dirty: {
    get: function() { return this._dirty; }
  },
  boundaries: {
    get: function() {
      var xBoundaries, yBoundaries;

      if (this._boundaries) {
        xBoundaries = this._boundaries.x;
        yBoundaries = this._boundaries.y;
      }

      if (!xBoundaries) { xBoundaries = this._data.vals.boundaries; }
      if (!yBoundaries) { yBoundaries = this._data.vals.boundaries; }

      var dataBoundaries;
      if (!xBoundaries || !yBoundaries) {
        dataBoundaries = new vis.models.Boundaries(
          Math.min.apply(undefined, this._data.vals.d),
          Math.max.apply(undefined, this._data.vals.d)
        );
      }

      if (!xBoundaries) { xBoundaries = dataBoundaries; }
      if (!yBoundaries) { yBoundaries = dataBoundaries; }

      return {
        x: xBoundaries,
        y: yBoundaries
      };
    },
    set: function(value) { this._boundaries = value; this.redrawRequired(); }
  },
  margins: {
    get: function() { return this._margins; },
    set: function(value) {
      if (!this._margins.equals(value)) {
        this._margins = value;
        this.redrawRequired();
      }
    }
  },
  width: {
    get: function() { return this._width; },
    set: function(value) {
      if (value != this._width) {
        this._width = value;
        this.redrawRequired();
      }
    }
  },
  height: {
    get: function() { return this._height; },
    set: function(value) {
      if (value != this._height) {
        this._height = value;
        this.redrawRequired();
      }
    }
  },
  dimensions: {
    get: function() {
      return { x: this.width, y: this.height };
    }
  },
  origins: {
    get: function() { return { x: this.margins.left, y: this.height - this.margins.bottom }; }
  },
  scales: {
    get: function() {
      var boundaries = this.boundaries;
      return {
        x: d3.scale.linear()
          .domain([boundaries.x.min, boundaries.x.max])
          .range([0, this.width - this.margins.left - this.margins.right]),
        y: d3.scale.linear()
          .domain([boundaries.y.min, boundaries.y.max])
          .range([this.height - this.margins.top - this.margins.bottom, 0])
      }
    }
  }
});

/**
 */
vis.ui.VisualizationOptions.prototype.redrawRequired = function() { ++this._dirty; };
